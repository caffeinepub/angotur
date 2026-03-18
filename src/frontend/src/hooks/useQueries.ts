import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewTourGuide, NewTouristSpot } from "../backend";
import type { BookingStatus, Variant_spot_guide } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllSpots() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["spots"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApprovedSpots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSpotsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["spots-admin"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSpots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllGuides() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGuides();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReviewsByTarget(targetId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reviews", targetId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviewsByTarget(targetId);
    },
    enabled: !!actor && !isFetching && !!targetId,
  });
}

export function useGetAdminStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      if (!actor) return [];
      const profile = await actor.getCallerUserProfile();
      if (!profile) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGuidesWithPendingFees() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["guides-pending-fees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGuidesWithPendingFees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSpotsWithPendingFees() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["spots-pending-fees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSpotsWithPendingFees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkGuideFeeAsPaid() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (guideId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markGuideFeeAsPaid(guideId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guides-pending-fees"] });
      qc.invalidateQueries({ queryKey: ["guides"] });
    },
  });
}

export function useMarkSpotFeeAsPaid() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (spotId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markSpotFeeAsPaid(spotId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spots-pending-fees"] });
      qc.invalidateQueries({ queryKey: ["spots-admin"] });
    },
  });
}

export function useCreateSpot() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewTouristSpot) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTouristSpot(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spots"] }),
  });
}

export function useCreateGuide() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewTourGuide) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTourGuide(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guides"] }),
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      guideId: string;
      spotId: string;
      startDate: string;
      endDate: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        data.guideId,
        data.spotId,
        data.startDate,
        data.endDate,
        data.message,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-bookings"] }),
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      targetId: string;
      targetType: Variant_spot_guide;
      rating: bigint;
      comment: string;
      authorName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReview(
        data.targetId,
        data.targetType,
        data.rating,
        data.comment,
        data.authorName,
      );
    },
    onSuccess: (_result, variables) =>
      qc.invalidateQueries({ queryKey: ["reviews", variables.targetId] }),
  });
}

export function useApproveSpot() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveTouristSpot(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spots-admin"] }),
  });
}

export function useRejectSpot() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectTouristSpot(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spots-admin"] }),
  });
}

export function useApproveGuide() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveTourGuide(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guides"] }),
  });
}

export function useRejectGuide() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectTourGuide(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guides"] }),
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: { bookingId: string; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-bookings"] }),
  });
}
