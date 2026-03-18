import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let touristSpots = Map.empty<Text, TouristSpot>();
  let tourGuides = Map.empty<Text, TourGuide>();
  let reviews = Map.empty<Text, Review>();
  let bookings = Map.empty<Text, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let guideOwners = Map.empty<Text, Principal>(); // Maps guide ID to owner Principal
  let spotOwners = Map.empty<Text, Principal>(); // Maps spot ID to owner Principal

  module TouristSpotCategory {
    public type Type = { #beach; #museum; #nature; #city; #historical };
  };

  module EntityStatus {
    public type Type = { #pending; #approved; #rejected };
  };

  public type FeeStatus = { #unpaid; #paid };

  public type TouristSpot = {
    id : Text;
    name : Text;
    description : Text;
    category : TouristSpotCategory.Type;
    location : Text;
    status : EntityStatus.Type;
    photos : [Storage.ExternalBlob];
    isPrivate : Bool;
    platformFee : Nat;
    feeStatus : FeeStatus;
  };

  public type NewTouristSpot = {
    name : Text;
    description : Text;
    category : TouristSpotCategory.Type;
    location : Text;
    photos : [Storage.ExternalBlob];
    isPrivate : Bool;
  };

  module TourGuideStatus {
    public type Type = { #pending; #approved; #rejected };
  };

  public type TourGuide = {
    id : Text;
    name : Text;
    bio : Text;
    languages : [Text];
    pricePerDay : Nat;
    available : Bool;
    status : TourGuideStatus.Type;
    profilePhoto : ?Storage.ExternalBlob;
    platformFee : Nat;
    feeStatus : FeeStatus;
  };

  public type NewTourGuide = {
    name : Text;
    bio : Text;
    languages : [Text];
    pricePerDay : Nat;
    available : Bool;
    profilePhoto : ?Storage.ExternalBlob;
  };

  public type BookingStatus = { #pending; #confirmed; #cancelled };

  public type Booking = {
    id : Text;
    guideId : Text;
    spotId : Text;
    userId : Principal;
    startDate : Text;
    endDate : Text;
    status : BookingStatus;
    message : Text;
    createdAt : Time.Time;
  };

  public type Review = {
    id : Text;
    targetId : Text;
    targetType : { #spot; #guide };
    rating : Nat;
    comment : Text;
    authorName : Text;
    userId : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  public type AdminStats = {
    totalSpots : Nat;
    totalGuides : Nat;
    pendingBookings : Nat;
    confirmedBookings : Nat;
    cancelledBookings : Nat;
    totalReviews : Nat;
  };

  let accessControlState = AccessControl.initState();

  // Include prefabricated mixins for resource-intensive features
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  //--- USER PROFILE MANAGEMENT ---//
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //--- TOURIST SPOTS ---//
  public shared ({ caller }) func createTouristSpot(newSpot : NewTouristSpot) : async TouristSpot {
    // Open to all: no login required
    let id = newSpot.name.concat(Time.now().toText());
    let (feeStatus, platformFee) =
      if (newSpot.isPrivate) { (#unpaid, 25000) } else {
        (#paid, 0);
      };

    let spot : TouristSpot = {
      id;
      name = newSpot.name;
      description = newSpot.description;
      category = newSpot.category;
      location = newSpot.location;
      status = #pending;
      photos = newSpot.photos;
      isPrivate = newSpot.isPrivate;
      feeStatus;
      platformFee;
    };
    touristSpots.add(id, spot);
    spotOwners.add(id, caller);
    spot;
  };

  public shared ({ caller }) func updateTouristSpot(id : Text, updatedSpot : NewTouristSpot) : async TouristSpot {
    let isOwner = switch (spotOwners.get(id)) {
      case (?owner) { owner == caller };
      case null { false };
    };

    if (not isOwner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the spot owner or admin can update this spot");
    };

    switch (touristSpots.get(id)) {
      case (?existing) {
        let spot : TouristSpot = {
          id;
          name = updatedSpot.name;
          description = updatedSpot.description;
          category = updatedSpot.category;
          location = updatedSpot.location;
          status = existing.status;
          photos = updatedSpot.photos;
          isPrivate = updatedSpot.isPrivate;
          platformFee = existing.platformFee;
          feeStatus = existing.feeStatus;
        };
        touristSpots.add(id, spot);
        spot;
      };
      case null {
        Runtime.trap("Tourist spot not found");
      };
    };
  };

  public shared ({ caller }) func approveTouristSpot(id : Text) : async TouristSpot {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve tourist spots");
    };
    switch (touristSpots.get(id)) {
      case (?spot) {
        let updated : TouristSpot = {
          id = spot.id;
          name = spot.name;
          description = spot.description;
          category = spot.category;
          location = spot.location;
          status = #approved;
          photos = spot.photos;
          isPrivate = spot.isPrivate;
          platformFee = spot.platformFee;
          feeStatus = spot.feeStatus;
        };
        touristSpots.add(id, updated);
        updated;
      };
      case null {
        Runtime.trap("Tourist spot not found");
      };
    };
  };

  public shared ({ caller }) func rejectTouristSpot(id : Text) : async TouristSpot {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject tourist spots");
    };
    switch (touristSpots.get(id)) {
      case (?spot) {
        let updated : TouristSpot = {
          id = spot.id;
          name = spot.name;
          description = spot.description;
          category = spot.category;
          location = spot.location;
          status = #rejected;
          photos = spot.photos;
          isPrivate = spot.isPrivate;
          platformFee = spot.platformFee;
          feeStatus = spot.feeStatus;
        };
        touristSpots.add(id, updated);
        updated;
      };
      case null {
        Runtime.trap("Tourist spot not found");
      };
    };
  };

  public shared ({ caller }) func deleteTouristSpot(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tourist spots");
    };
    touristSpots.remove(id);
    spotOwners.remove(id);
  };

  public query ({ caller }) func getTouristSpotsByCategory(category : TouristSpotCategory.Type) : async [TouristSpot] {
    touristSpots.values().toArray().filter(
      func(spot) {
        spot.category == category;
      }
    );
  };

  public query ({ caller }) func getAllApprovedSpots() : async [TouristSpot] {
    touristSpots.values().toArray().filter(
      func(spot) {
        switch (spot.status) {
          case (#approved) { true };
          case (_) { false };
        };
      }
    );
  };

  public query ({ caller }) func getAllSpots() : async [TouristSpot] {
    touristSpots.values().toArray();
  };

  //--- TOUR GUIDES ---//
  public shared ({ caller }) func addTourGuide(newGuide : NewTourGuide) : async TourGuide {
    // Open to all: no login required
    let id = newGuide.name.concat(Time.now().toText());
    let guide : TourGuide = {
      id;
      name = newGuide.name;
      bio = newGuide.bio;
      languages = newGuide.languages;
      pricePerDay = newGuide.pricePerDay;
      available = newGuide.available;
      status = #pending;
      profilePhoto = newGuide.profilePhoto;
      platformFee = 15000;
      feeStatus = #unpaid;
    };
    tourGuides.add(id, guide);
    guideOwners.add(id, caller);
    guide;
  };

  public shared ({ caller }) func updateTourGuide(id : Text, updatedGuide : NewTourGuide) : async TourGuide {
    let isOwner = switch (guideOwners.get(id)) {
      case (?owner) { owner == caller };
      case null { false };
    };

    if (not isOwner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the guide owner or admin can update this guide");
    };

    switch (tourGuides.get(id)) {
      case (?existing) {
        let guide : TourGuide = {
          id;
          name = updatedGuide.name;
          bio = updatedGuide.bio;
          languages = updatedGuide.languages;
          pricePerDay = updatedGuide.pricePerDay;
          available = updatedGuide.available;
          status = existing.status;
          profilePhoto = updatedGuide.profilePhoto;
          platformFee = existing.platformFee;
          feeStatus = existing.feeStatus;
        };
        tourGuides.add(id, guide);
        guide;
      };
      case null {
        Runtime.trap("Tour guide not found");
      };
    };
  };

  public shared ({ caller }) func approveTourGuide(id : Text) : async TourGuide {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve tour guides");
    };
    switch (tourGuides.get(id)) {
      case (?guide) {
        let updated : TourGuide = {
          id = guide.id;
          name = guide.name;
          bio = guide.bio;
          languages = guide.languages;
          pricePerDay = guide.pricePerDay;
          available = guide.available;
          status = #approved;
          profilePhoto = guide.profilePhoto;
          platformFee = guide.platformFee;
          feeStatus = guide.feeStatus;
        };
        tourGuides.add(id, updated);
        updated;
      };
      case null {
        Runtime.trap("Tour guide not found");
      };
    };
  };

  public shared ({ caller }) func rejectTourGuide(id : Text) : async TourGuide {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject tour guides");
    };
    switch (tourGuides.get(id)) {
      case (?guide) {
        let updated : TourGuide = {
          id = guide.id;
          name = guide.name;
          bio = guide.bio;
          languages = guide.languages;
          pricePerDay = guide.pricePerDay;
          available = guide.available;
          status = #rejected;
          profilePhoto = guide.profilePhoto;
          platformFee = guide.platformFee;
          feeStatus = guide.feeStatus;
        };
        tourGuides.add(id, updated);
        updated;
      };
      case null {
        Runtime.trap("Tour guide not found");
      };
    };
  };

  public shared ({ caller }) func deleteTourGuide(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tour guides");
    };
    tourGuides.remove(id);
    guideOwners.remove(id);
  };

  public query ({ caller }) func getAllGuides() : async [TourGuide] {
    tourGuides.values().toArray();
  };

  public query ({ caller }) func getAvailableGuides() : async [TourGuide] {
    tourGuides.values().toArray().filter(func(guide) { guide.available });
  };

  //--- FEES MANAGEMENT ---//
  public query ({ caller }) func getGuidesWithPendingFees() : async [TourGuide] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending fees");
    };
    tourGuides.values().toArray().filter(
      func(guide) { guide.feeStatus == #unpaid }
    );
  };

  public query ({ caller }) func getSpotsWithPendingFees() : async [TouristSpot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending fees");
    };
    touristSpots.values().toArray().filter(
      func(spot) { spot.feeStatus == #unpaid and spot.isPrivate }
    );
  };

  public shared ({ caller }) func markGuideFeeAsPaid(guideId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark fees as paid");
    };
    switch (tourGuides.get(guideId)) {
      case (?guide) {
        let updated : TourGuide = {
          id = guide.id;
          name = guide.name;
          bio = guide.bio;
          languages = guide.languages;
          pricePerDay = guide.pricePerDay;
          available = guide.available;
          status = guide.status;
          profilePhoto = guide.profilePhoto;
          platformFee = guide.platformFee;
          feeStatus = #paid;
        };
        tourGuides.add(guideId, updated);
      };
      case null {
        Runtime.trap("Guide not found");
      };
    };
  };

  public shared ({ caller }) func markSpotFeeAsPaid(spotId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark fees as paid");
    };
    switch (touristSpots.get(spotId)) {
      case (?spot) {
        let updated : TouristSpot = {
          id = spot.id;
          name = spot.name;
          description = spot.description;
          category = spot.category;
          location = spot.location;
          status = spot.status;
          photos = spot.photos;
          isPrivate = spot.isPrivate;
          platformFee = spot.platformFee;
          feeStatus = #paid;
        };
        touristSpots.add(spotId, updated);
      };
      case null {
        Runtime.trap("Spot not found");
      };
    };
  };

  //--- BOOKINGS ---//
  public shared ({ caller }) func createBooking(guideId : Text, spotId : Text, startDate : Text, endDate : Text, message : Text) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    let bookingId = guideId.concat(Time.now().toText());
    let booking : Booking = {
      id = bookingId;
      guideId;
      spotId;
      userId = caller;
      startDate;
      endDate;
      status = #pending;
      message;
      createdAt = Time.now();
    };

    bookings.add(bookingId, booking);
    booking;
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Text, newStatus : BookingStatus) : async Booking {
    switch (bookings.get(bookingId)) {
      case (?booking) {
        let isOwner = booking.userId == caller;
        let isGuideOwner = switch (guideOwners.get(booking.guideId)) {
          case (?owner) { owner == caller };
          case null { false };
        };

        if (not isOwner and not isGuideOwner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the booking owner, guide, or admin can update this booking");
        };

        let updated : Booking = {
          id = booking.id;
          guideId = booking.guideId;
          spotId = booking.spotId;
          userId = booking.userId;
          startDate = booking.startDate;
          endDate = booking.endDate;
          status = newStatus;
          message = booking.message;
          createdAt = booking.createdAt;
        };
        bookings.add(bookingId, updated);
        updated;
      };
      case null {
        Runtime.trap("Booking not found");
      };
    };
  };

  public query ({ caller }) func getBookingsByUser(userId : Principal) : async [Booking] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };
    bookings.values().toArray().filter(
      func(booking) {
        booking.userId == userId;
      }
    );
  };

  public query ({ caller }) func getBookingsByGuide(guideId : Text) : async [Booking] {
    let isGuideOwner = switch (guideOwners.get(guideId)) {
      case (?owner) { owner == caller };
      case null { false };
    };

    if (not isGuideOwner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the guide owner or admin can view guide bookings");
    };

    bookings.values().toArray().filter(
      func(booking) {
        booking.guideId == guideId;
      }
    );
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  //--- REVIEWS ---//
  public shared ({ caller }) func addReview(targetId : Text, targetType : { #spot; #guide }, rating : Nat, comment : Text, authorName : Text) : async Review {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Invalid rating: must be between 1 and 5");
    };

    let reviewId = targetId.concat(Time.now().toText());
    let review : Review = {
      id = reviewId;
      targetId;
      targetType;
      rating;
      comment;
      authorName;
      userId = caller;
    };

    reviews.add(reviewId, review);
    review;
  };

  public shared ({ caller }) func deleteReview(reviewId : Text) : async () {
    switch (reviews.get(reviewId)) {
      case (?review) {
        if (review.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the review author or admin can delete this review");
        };
        reviews.remove(reviewId);
      };
      case null {
        Runtime.trap("Review not found");
      };
    };
  };

  public query ({ caller }) func getReviewsByTarget(targetId : Text) : async [Review] {
    reviews.values().toArray().filter(func(review) { review.targetId == targetId });
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };

  //--- ADMIN STATS ---//
  public query ({ caller }) func getAdminStats() : async AdminStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };

    let allBookings = bookings.values().toArray();
    var pendingCount = 0;
    var confirmedCount = 0;
    var cancelledCount = 0;

    for (booking in allBookings.vals()) {
      switch (booking.status) {
        case (#pending) { pendingCount += 1 };
        case (#confirmed) { confirmedCount += 1 };
        case (#cancelled) { cancelledCount += 1 };
      };
    };

    {
      totalSpots = touristSpots.size();
      totalGuides = tourGuides.size();
      pendingBookings = pendingCount;
      confirmedBookings = confirmedCount;
      cancelledBookings = cancelledCount;
      totalReviews = reviews.size();
    };
  };
};
