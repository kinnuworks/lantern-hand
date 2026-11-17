# Staging break test (seed 20261118)

Test slice: 161 of 161 rooms pass. Our own naive baseline (fixed offsets, no scene data): 0 of 161.
Tuning rooms (sunlit_living_room, home_office) are listed but not counted. `*` marks a fallback surface.

| Room | Slice | Result | Where each beat landed | Failures | Naive baseline |
|---|---|---|---|---|---|
| bedroom | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (9) |
| bedroom/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| bedroom/no-window-door | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (9) |
| bedroom/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| bedroom/table-only | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (8) |
| bedroom/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| conference_room | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/no-window-door | test | pass | table:table ridge:table* sea:floor gate:wall art* window:wall* | - | fail (6) |
| conference_room/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| conference_room/table-only | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (5) |
| conference_room/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| home_office | tuning | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| home_office/no-couch | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (6) |
| home_office/no-window-door | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (5) |
| home_office/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| home_office/table-only | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| home_office/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| kitchen | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (10) |
| kitchen/no-couch | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (10) |
| kitchen/no-window-door | test | pass | table:table ridge:table* sea:floor gate:floor* window:wall* | - | fail (10) |
| kitchen/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| kitchen/table-only | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (7) |
| kitchen/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| music_studio | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/no-couch | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| music_studio/no-window-door | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (4) |
| music_studio/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| music_studio/table-only | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| music_studio/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| open_office | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (6) |
| open_office/no-couch | test | pass | table:desk ridge:table* sea:floor gate:wall* window:wall* | - | fail (7) |
| open_office/no-window-door | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (6) |
| open_office/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| open_office/table-only | test | pass | table:desk ridge:desk* sea:floor gate:door window:window | - | fail (7) |
| open_office/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (4) |
| open_studio/no-couch | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (4) |
| open_studio/no-window-door | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| open_studio/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| open_studio/walls-only | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (8) |
| sunlit_living_room | tuning | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (4) |
| sunlit_living_room/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (5) |
| sunlit_living_room/no-window-door | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (4) |
| sunlit_living_room/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| sunlit_living_room/table-only | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (8) |
| sunlit_living_room/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (7) |
| standin/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (9) |
| standin/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (10) |
| standin/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (12) |
| standin/facing-3 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (6) |
| bedroom/seat(1,0)/facing-0 | test | pass | table:bed* ridge:bed* sea:floor gate:wall* window:wall art* | - | fail (10) |
| bedroom/seat(1,0)/facing-1 | test | pass | table:bed* ridge:bed* sea:floor gate:wall art* window:wall* | - | fail (15) |
| bedroom/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (15) |
| bedroom/seat(1,0)/facing-3 | test | pass | table:bed* ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| bedroom/seat(-1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| bedroom/seat(-1,0)/facing-1 | test | pass | table:bed* ridge:bed* sea:floor gate:door window:wall art* | - | fail (10) |
| bedroom/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (14) |
| bedroom/seat(-1,0)/facing-3 | test | pass | table:couch* ridge:couch* sea:floor gate:wall* window:window | - | fail (14) |
| bedroom/seat(0,1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| bedroom/seat(0,1)/facing-1 | test | pass | table:bed* ridge:bed* sea:floor gate:door window:wall art* | - | fail (13) |
| bedroom/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (14) |
| bedroom/seat(0,1)/facing-3 | test | pass | table:couch* ridge:couch* sea:floor gate:wall* window:window | - | fail (13) |
| conference_room/seat(1,0)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| conference_room/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (11) |
| conference_room/seat(1,0)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (6) |
| conference_room/seat(-1,0)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (5) |
| conference_room/seat(-1,0)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (6) |
| conference_room/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (10) |
| conference_room/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| conference_room/seat(0,1)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (10) |
| conference_room/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor* gate:door window:window | - | fail (11) |
| conference_room/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| home_office/seat(-1,0)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| home_office/seat(-1,0)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (5) |
| home_office/seat(-1,0)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (9) |
| home_office/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| home_office/seat(0,1)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| home_office/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall art* | - | fail (8) |
| home_office/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (9) |
| home_office/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:floor* window:wall* | - | fail (8) |
| home_office/seat(0,-1)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (6) |
| home_office/seat(0,-1)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall art* | - | fail (9) |
| home_office/seat(0,-1)/facing-2 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall art* | - | fail (9) |
| home_office/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| kitchen/seat(1,0)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (10) |
| kitchen/seat(1,0)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (15) |
| kitchen/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (15) |
| kitchen/seat(1,0)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (10) |
| kitchen/seat(-1,0)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (10) |
| kitchen/seat(-1,0)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (11) |
| kitchen/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (15) |
| kitchen/seat(-1,0)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:wall* window:wall* | - | fail (15) |
| kitchen/seat(0,1)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (10) |
| kitchen/seat(0,1)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (14) |
| kitchen/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (15) |
| kitchen/seat(0,1)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:door window:wall* | - | fail (14) |
| music_studio/seat(1,0)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| music_studio/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (9) |
| music_studio/seat(1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/seat(-1,0)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/seat(-1,0)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (5) |
| music_studio/seat(-1,0)/facing-2 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall* | - | fail (9) |
| music_studio/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| music_studio/seat(0,1)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/seat(0,1)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| music_studio/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (9) |
| music_studio/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| music_studio/seat(0,-1)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| music_studio/seat(0,-1)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| music_studio/seat(0,-1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (8) |
| music_studio/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| open_office/seat(1,0)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (6) |
| open_office/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| open_office/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (11) |
| open_office/seat(1,0)/facing-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall* | - | fail (6) |
| open_office/seat(-1,0)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall art* window:wall art* | - | fail (6) |
| open_office/seat(-1,0)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| open_office/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (11) |
| open_office/seat(-1,0)/facing-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (11) |
| open_office/seat(0,1)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (6) |
| open_office/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| open_office/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (11) |
| open_office/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (10) |
| open_office/seat(0,-1)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall art* | - | fail (7) |
| open_office/seat(0,-1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| open_office/seat(0,-1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (10) |
| open_office/seat(0,-1)/facing-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (10) |
| open_studio/seat(1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (4) |
| open_studio/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_studio/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_studio/seat(1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| open_studio/seat(-1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (4) |
| open_studio/seat(-1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (5) |
| open_studio/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| open_studio/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| open_studio/seat(0,1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (4) |
| open_studio/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_studio/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| open_studio/seat(0,-1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (5) |
| open_studio/seat(0,-1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (8) |
| open_studio/seat(0,-1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| open_studio/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| sunlit_living_room/seat(1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (5) |
| sunlit_living_room/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (10) |
| sunlit_living_room/seat(1,0)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall* | - | fail (10) |
| sunlit_living_room/seat(1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (5) |
| sunlit_living_room/seat(-1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| sunlit_living_room/seat(-1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (5) |
| sunlit_living_room/seat(-1,0)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (9) |
| sunlit_living_room/seat(-1,0)/facing-3 | test | pass | table:couch* ridge:couch* sea:floor gate:wall art* window:window | - | fail (9) |
| sunlit_living_room/seat(0,1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| sunlit_living_room/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (8) |
| sunlit_living_room/seat(0,1)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (9) |
| sunlit_living_room/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| sunlit_living_room/seat(0,-1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (5) |
| sunlit_living_room/seat(0,-1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| sunlit_living_room/seat(0,-1)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (8) |
| sunlit_living_room/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
