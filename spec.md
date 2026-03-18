# Angotur

## Current State
O cadastro de pontos turísticos e guias exige que o utilizador esteja autenticado via Internet Identity. O backend verifica o papel `#user` via `AccessControl.hasPermission` antes de permitir `createTouristSpot` e `addTourGuide`. O frontend exibe um ecrã de bloqueio com botão de login quando o utilizador não está autenticado.

## Requested Changes (Diff)

### Add
- Nenhum

### Modify
- **Backend**: Remover verificação de autorização (`#user` role) de `createTouristSpot` e `addTourGuide`, permitindo qualquer pessoa (incluindo utilizadores anónimos) cadastrar.
- **Frontend RegisterSpotPage**: Remover bloqueio de login, remover verificação de identidade no handleSubmit, remover chamada `saveCallerUserProfile`.
- **Frontend RegisterGuidePage**: Idem.

### Remove
- Requisito de login para cadastrar pontos turísticos e guias.

## Implementation Plan
1. Atualizar `main.mo`: remover checks de `#user` em `createTouristSpot` e `addTourGuide`.
2. Atualizar `RegisterSpotPage.tsx`: remover bloqueio de login e verificação de identidade.
3. Atualizar `RegisterGuidePage.tsx`: idem.
