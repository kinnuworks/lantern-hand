# Staging break test (seed 20261118)

Test slice: 34 of 34 rooms pass. Our own naive baseline (fixed offsets, no scene data): 0 of 34.
Tuning rooms (sunlit_living_room, home_office) are listed but not counted. `*` marks a fallback surface.

| Room | Slice | Result | Where each beat landed | Failures | Naive baseline |
|---|---|---|---|---|---|
| bedroom | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (9) |
| bedroom/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| bedroom/no-window-door | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (9) |
| bedroom/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| conference_room | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/no-window-door | test | pass | table:table ridge:table* sea:floor gate:wall art* window:wall* | - | fail (6) |
| conference_room/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (3) |
| home_office | tuning | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| home_office/no-couch | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (6) |
| home_office/no-window-door | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (5) |
| home_office/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| kitchen | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (10) |
| kitchen/no-couch | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (10) |
| kitchen/no-window-door | test | pass | table:table ridge:table* sea:floor gate:floor* window:wall* | - | fail (10) |
| kitchen/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| music_studio | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/no-couch | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| music_studio/no-window-door | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (4) |
| music_studio/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| open_office | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (6) |
| open_office/no-couch | test | pass | table:desk ridge:table* sea:floor gate:wall* window:wall* | - | fail (7) |
| open_office/no-window-door | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (6) |
| open_office/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| open_studio | test | pass | table:floor* ridge:floor* sea:floor gate:door window:wall* | - | fail (4) |
| open_studio/no-couch | test | pass | table:floor* ridge:floor* sea:floor gate:door window:wall* | - | fail (4) |
| open_studio/no-window-door | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| open_studio/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| sunlit_living_room | tuning | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (4) |
| sunlit_living_room/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (5) |
| sunlit_living_room/no-window-door | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (4) |
| sunlit_living_room/floor-walls-only | test | pass | table:floor* ridge:floor* sea:floor gate:wall* window:wall* | - | fail (4) |
| standin/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (9) |
| standin/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (10) |
| standin/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (12) |
| standin/facing-3 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (6) |
