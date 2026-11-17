# Staging break test (seed 20261118)

Test slice: 401 of 401 rooms pass. Our own naive baseline (fixed offsets, no scene data): 0 of 401.
Random seats skipped as out of scope (facing a wall under 0.9 m away): 22.
Tuning rooms (sunlit_living_room, home_office) are listed but not counted. `*` marks a fallback surface.

| Room | Slice | Result | Where each beat landed | Failures | Naive baseline |
|---|---|---|---|---|---|
| bedroom | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (8) |
| bedroom/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (5) |
| bedroom/no-window-door | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (8) |
| bedroom/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| bedroom/table-only | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| bedroom/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| conference_room | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/no-window-door | test | pass | table:table ridge:table* sea:floor gate:wall art* window:wall* | - | fail (6) |
| conference_room/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| conference_room/table-only | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (5) |
| conference_room/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| home_office | tuning | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| home_office/no-couch | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| home_office/no-window-door | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (4) |
| home_office/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| home_office/table-only | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| home_office/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| kitchen | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (9) |
| kitchen/no-couch | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (9) |
| kitchen/no-window-door | test | pass | table:table ridge:table* sea:floor gate:floor* window:wall* | - | fail (9) |
| kitchen/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| kitchen/table-only | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (7) |
| kitchen/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| music_studio | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (3) |
| music_studio/no-couch | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/no-window-door | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (3) |
| music_studio/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| music_studio/table-only | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| music_studio/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| open_office | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (5) |
| open_office/no-couch | test | pass | table:desk ridge:table* sea:floor gate:wall* window:wall* | - | fail (6) |
| open_office/no-window-door | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (5) |
| open_office/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| open_office/table-only | test | pass | table:desk ridge:desk* sea:floor gate:door window:window | - | fail (7) |
| open_office/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (3) |
| open_studio/no-couch | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (3) |
| open_studio/no-window-door | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| open_studio/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| open_studio/walls-only | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (8) |
| sunlit_living_room | tuning | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (3) |
| sunlit_living_room/no-couch | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (4) |
| sunlit_living_room/no-window-door | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (3) |
| sunlit_living_room/floor-walls-only | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (3) |
| sunlit_living_room/table-only | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (8) |
| sunlit_living_room/walls-only | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (7) |
| standin/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (9) |
| standin/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (10) |
| standin/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (12) |
| standin/facing-3 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (6) |
| bedroom/seat(1,0)/facing-0 | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (9) |
| bedroom/seat(1,0)/facing-1 | test | pass | table:bed* ridge:bed* sea:floor gate:wall art* window:wall* | - | fail (14) |
| bedroom/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (14) |
| bedroom/seat(1,0)/facing-3 | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (9) |
| bedroom/seat(-1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| bedroom/seat(-1,0)/facing-1 | test | pass | table:table ridge:bed sea:floor gate:door window:wall art* | - | fail (9) |
| bedroom/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (13) |
| bedroom/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| bedroom/seat(0,1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| bedroom/seat(0,1)/facing-1 | test | pass | table:table ridge:bed sea:floor gate:door window:wall art* | - | fail (12) |
| bedroom/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (13) |
| bedroom/seat(0,1)/facing-3 | test | pass | table:couch* ridge:couch* sea:floor gate:wall* window:window | - | fail (12) |
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
| conference_room/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:couch* gate:door window:window | - | fail (11) |
| conference_room/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| home_office/seat(-1,0)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (3) |
| home_office/seat(-1,0)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (4) |
| home_office/seat(-1,0)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (8) |
| home_office/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| home_office/seat(0,1)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (3) |
| home_office/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall art* | - | fail (7) |
| home_office/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (8) |
| home_office/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:floor* window:wall* | - | fail (7) |
| home_office/seat(0,-1)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| home_office/seat(0,-1)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall art* | - | fail (8) |
| home_office/seat(0,-1)/facing-2 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall art* | - | fail (8) |
| home_office/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| kitchen/seat(1,0)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (9) |
| kitchen/seat(1,0)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (14) |
| kitchen/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (14) |
| kitchen/seat(1,0)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (9) |
| kitchen/seat(-1,0)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (9) |
| kitchen/seat(-1,0)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (10) |
| kitchen/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (14) |
| kitchen/seat(-1,0)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:wall* window:wall* | - | fail (14) |
| kitchen/seat(0,1)/facing-0 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (9) |
| kitchen/seat(0,1)/facing-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (13) |
| kitchen/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (14) |
| kitchen/seat(0,1)/facing-3 | test | pass | table:table ridge:table* sea:floor gate:door window:wall* | - | fail (13) |
| music_studio/seat(1,0)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (3) |
| music_studio/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| music_studio/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (8) |
| music_studio/seat(1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (3) |
| music_studio/seat(-1,0)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (3) |
| music_studio/seat(-1,0)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (4) |
| music_studio/seat(-1,0)/facing-2 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall* | - | fail (8) |
| music_studio/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| music_studio/seat(0,1)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (3) |
| music_studio/seat(0,1)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| music_studio/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| music_studio/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| music_studio/seat(0,-1)/facing-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/seat(0,-1)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| music_studio/seat(0,-1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (7) |
| music_studio/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (7) |
| open_office/seat(1,0)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (5) |
| open_office/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| open_office/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (10) |
| open_office/seat(1,0)/facing-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall* | - | fail (5) |
| open_office/seat(-1,0)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall art* window:wall art* | - | fail (5) |
| open_office/seat(-1,0)/facing-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (6) |
| open_office/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (10) |
| open_office/seat(-1,0)/facing-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (10) |
| open_office/seat(0,1)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (5) |
| open_office/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| open_office/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (10) |
| open_office/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_office/seat(0,-1)/facing-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall art* | - | fail (6) |
| open_office/seat(0,-1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| open_office/seat(0,-1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (9) |
| open_office/seat(0,-1)/facing-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (9) |
| open_studio/seat(1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (3) |
| open_studio/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio/seat(1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio/seat(1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (3) |
| open_studio/seat(-1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (3) |
| open_studio/seat(-1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (4) |
| open_studio/seat(-1,0)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| open_studio/seat(-1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| open_studio/seat(0,1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (3) |
| open_studio/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| open_studio/seat(0,1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| open_studio/seat(0,-1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (4) |
| open_studio/seat(0,-1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (7) |
| open_studio/seat(0,-1)/facing-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| open_studio/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| sunlit_living_room/seat(1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (4) |
| sunlit_living_room/seat(1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| sunlit_living_room/seat(1,0)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall* | - | fail (9) |
| sunlit_living_room/seat(1,0)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (4) |
| sunlit_living_room/seat(-1,0)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (3) |
| sunlit_living_room/seat(-1,0)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (4) |
| sunlit_living_room/seat(-1,0)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (8) |
| sunlit_living_room/seat(-1,0)/facing-3 | test | pass | table:couch* ridge:couch* sea:floor gate:wall art* window:window | - | fail (8) |
| sunlit_living_room/seat(0,1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (3) |
| sunlit_living_room/seat(0,1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (7) |
| sunlit_living_room/seat(0,1)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (8) |
| sunlit_living_room/seat(0,1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| sunlit_living_room/seat(0,-1)/facing-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (4) |
| sunlit_living_room/seat(0,-1)/facing-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| sunlit_living_room/seat(0,-1)/facing-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (7) |
| sunlit_living_room/seat(0,-1)/facing-3 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (7) |
| bedroom/random-0 | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (8) |
| bedroom/random-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| bedroom/random-2 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (15) |
| bedroom/random-3 | test | pass | table:table ridge:bed sea:bed* gate:bed* window:wall art* | - | fail (13) |
| bedroom/random-4 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (13) |
| bedroom/random-5 | test | pass | table:table ridge:bed sea:floor gate:door window:wall art* | - | fail (7) |
| bedroom/random-6 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall art* | - | fail (9) |
| bedroom/random-7 | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (8) |
| bedroom/random-8 | test | pass | table:table ridge:bed sea:floor gate:wall art* window:wall* | - | fail (8) |
| bedroom/random-9 | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (13) |
| bedroom/random-10 | test | pass | table:table ridge:bed sea:floor gate:door window:wall art* | - | fail (10) |
| bedroom/random-11 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (14) |
| bedroom/random-12 | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (8) |
| bedroom/random-13 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (13) |
| bedroom/random-14 | test | pass | table:table ridge:bed sea:floor gate:wall art* window:wall art* | - | fail (10) |
| bedroom/random-15 | test | pass | table:table ridge:bed sea:floor gate:wall art* window:wall* | - | fail (12) |
| bedroom/random-16 | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (11) |
| bedroom/random-17 | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (10) |
| bedroom/random-18 | test | pass | table:couch* ridge:couch* sea:floor gate:wall* window:window | - | fail (12) |
| bedroom/random-19 | test | pass | table:bed* ridge:bed* sea:floor gate:door window:wall art* | - | fail (13) |
| bedroom/random-20 | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (7) |
| bedroom/random-21 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:window | - | fail (15) |
| bedroom/random-22 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:window | - | fail (15) |
| bedroom/random-23 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (14) |
| bedroom/random-24 | test | pass | table:table ridge:bed sea:floor gate:wall* window:wall* | - | fail (12) |
| bedroom/random-25 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (12) |
| bedroom/random-26 | test | pass | table:table ridge:bed sea:floor gate:wall* window:window | - | fail (11) |
| bedroom/random-27 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:window | - | fail (12) |
| bedroom/random-28 | test | pass | table:table ridge:bed sea:floor gate:door window:wall art* | - | fail (15) |
| bedroom/random-29 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (14) |
| conference_room/random-0 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (11) |
| conference_room/random-1 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (9) |
| conference_room/random-2 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (10) |
| conference_room/random-3 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (9) |
| conference_room/random-4 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| conference_room/random-5 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (6) |
| conference_room/random-6 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (12) |
| conference_room/random-7 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (10) |
| conference_room/random-8 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| conference_room/random-9 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (15) |
| conference_room/random-10 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (9) |
| conference_room/random-11 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (10) |
| conference_room/random-12 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (12) |
| conference_room/random-13 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| conference_room/random-14 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (7) |
| conference_room/random-15 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (15) |
| conference_room/random-16 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (11) |
| conference_room/random-17 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (9) |
| conference_room/random-18 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| conference_room/random-19 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (12) |
| conference_room/random-20 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| conference_room/random-21 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (10) |
| conference_room/random-22 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| conference_room/random-23 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (14) |
| conference_room/random-24 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| conference_room/random-25 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (8) |
| conference_room/random-26 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (6) |
| conference_room/random-27 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (9) |
| conference_room/random-28 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (7) |
| conference_room/random-29 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| home_office/random-0 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (10) |
| home_office/random-1 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (6) |
| home_office/random-2 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| home_office/random-3 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| home_office/random-4 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (11) |
| home_office/random-5 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| home_office/random-6 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall art* | - | fail (10) |
| home_office/random-7 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| home_office/random-8 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (3) |
| home_office/random-9 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| home_office/random-10 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (13) |
| home_office/random-11 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (8) |
| home_office/random-12 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (10) |
| home_office/random-13 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (9) |
| home_office/random-14 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| home_office/random-15 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall art* | - | fail (10) |
| home_office/random-16 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall art* | - | fail (11) |
| home_office/random-17 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (6) |
| home_office/random-18 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall art* | - | fail (12) |
| home_office/random-19 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall art* | - | fail (8) |
| home_office/random-20 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| home_office/random-21 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (9) |
| home_office/random-22 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (10) |
| home_office/random-23 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| home_office/random-24 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (10) |
| home_office/random-25 | test | pass | table:desk ridge:couch sea:floor gate:door window:wall art* | - | fail (5) |
| home_office/random-26 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (11) |
| home_office/random-27 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (8) |
| home_office/random-28 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| home_office/random-29 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (9) |
| kitchen/random-0 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (15) |
| kitchen/random-1 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (10) |
| kitchen/random-2 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (16) |
| kitchen/random-3 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (15) |
| kitchen/random-4 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (16) |
| kitchen/random-5 | test | pass | table:table ridge:table* sea:floor gate:wall* window:wall* | - | fail (18) |
| kitchen/random-6 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (18) |
| kitchen/random-7 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (15) |
| kitchen/random-8 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (11) |
| kitchen/random-9 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (11) |
| kitchen/random-10 | test | pass | table:table ridge:table* sea:floor gate:door window:wall* | - | fail (12) |
| kitchen/random-11 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (16) |
| kitchen/random-12 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (12) |
| kitchen/random-13 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (14) |
| kitchen/random-14 | test | pass | table:table ridge:table* sea:floor gate:wall* window:wall* | - | fail (11) |
| kitchen/random-15 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:window | - | fail (11) |
| kitchen/random-16 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (16) |
| kitchen/random-17 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (13) |
| kitchen/random-18 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (17) |
| kitchen/random-19 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (16) |
| kitchen/random-20 | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (11) |
| kitchen/random-21 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (12) |
| kitchen/random-22 | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (15) |
| kitchen/random-23 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (11) |
| kitchen/random-24 | test | pass | table:table ridge:table* sea:floor gate:door window:wall* | - | fail (14) |
| kitchen/random-25 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (14) |
| kitchen/random-26 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (15) |
| kitchen/random-27 | test | pass | table:table ridge:table* sea:floor gate:wall* window:window | - | fail (11) |
| kitchen/random-28 | test | pass | table:table ridge:table* sea:floor gate:floor* window:window | - | fail (13) |
| kitchen/random-29 | test | pass | table:table ridge:table* sea:floor gate:door window:window | - | fail (12) |
| music_studio/random-0 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (6) |
| music_studio/random-1 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| music_studio/random-2 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| music_studio/random-3 | test | pass | table:table ridge:desk* sea:floor gate:wall* window:wall* | - | fail (10) |
| music_studio/random-4 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| music_studio/random-5 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| music_studio/random-6 | test | pass | table:desk ridge:desk* sea:floor gate:door window:window | - | fail (6) |
| music_studio/random-7 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| music_studio/random-8 | test | pass | table:table ridge:desk* sea:floor gate:wall* window:wall* | - | fail (9) |
| music_studio/random-9 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall* | - | fail (7) |
| music_studio/random-10 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (11) |
| music_studio/random-11 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (5) |
| music_studio/random-12 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (11) |
| music_studio/random-13 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall* | - | fail (10) |
| music_studio/random-14 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (13) |
| music_studio/random-15 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (12) |
| music_studio/random-16 | test | pass | table:couch* ridge:couch* sea:floor gate:wall* window:wall* | - | fail (12) |
| music_studio/random-17 | test | pass | table:couch* ridge:couch* sea:floor gate:door window:wall* | - | fail (6) |
| music_studio/random-18 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| music_studio/random-19 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/random-20 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| music_studio/random-21 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| music_studio/random-22 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (5) |
| music_studio/random-23 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (10) |
| music_studio/random-24 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (10) |
| music_studio/random-25 | test | pass | table:couch* ridge:couch sea:floor gate:wall* window:wall* | - | fail (11) |
| music_studio/random-26 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (7) |
| music_studio/random-27 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (13) |
| music_studio/random-28 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:window | - | fail (4) |
| music_studio/random-29 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (13) |
| open_office/random-0 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (13) |
| open_office/random-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| open_office/random-2 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (13) |
| open_office/random-3 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (12) |
| open_office/random-4 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (14) |
| open_office/random-5 | test | pass | table:desk ridge:couch sea:floor gate:door window:window | - | fail (8) |
| open_office/random-6 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| open_office/random-7 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (15) |
| open_office/random-8 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall* | - | fail (7) |
| open_office/random-9 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| open_office/random-10 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (14) |
| open_office/random-11 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| open_office/random-12 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (6) |
| open_office/random-13 | test | pass | table:couch* ridge:couch* sea:floor gate:wall* window:wall* | - | fail (12) |
| open_office/random-14 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| open_office/random-15 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (14) |
| open_office/random-16 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (14) |
| open_office/random-17 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_office/random-18 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| open_office/random-19 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall art* | - | fail (12) |
| open_office/random-20 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (14) |
| open_office/random-21 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (14) |
| open_office/random-22 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (15) |
| open_office/random-23 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (11) |
| open_office/random-24 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| open_office/random-25 | test | pass | table:desk ridge:desk* sea:floor gate:wall* window:wall art* | - | fail (11) |
| open_office/random-26 | test | pass | table:desk ridge:couch sea:floor gate:wall* window:window | - | fail (11) |
| open_office/random-27 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (13) |
| open_office/random-28 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (13) |
| open_office/random-29 | test | pass | table:desk ridge:desk* sea:floor gate:door window:wall* | - | fail (13) |
| open_studio/random-0 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (5) |
| open_studio/random-1 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_studio/random-2 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (10) |
| open_studio/random-3 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (8) |
| open_studio/random-4 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| open_studio/random-5 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall* | - | fail (5) |
| open_studio/random-6 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (5) |
| open_studio/random-7 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (10) |
| open_studio/random-8 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall* | - | fail (5) |
| open_studio/random-9 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_studio/random-10 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| open_studio/random-11 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (5) |
| open_studio/random-12 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (8) |
| open_studio/random-13 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (7) |
| open_studio/random-14 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall* | - | fail (5) |
| open_studio/random-15 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (3) |
| open_studio/random-16 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall* | - | fail (9) |
| open_studio/random-17 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall* | - | fail (7) |
| open_studio/random-18 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (10) |
| open_studio/random-19 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (10) |
| open_studio/random-20 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (4) |
| open_studio/random-21 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| open_studio/random-22 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| open_studio/random-23 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (10) |
| open_studio/random-24 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (10) |
| open_studio/random-25 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (5) |
| open_studio/random-26 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (7) |
| open_studio/random-27 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (6) |
| open_studio/random-28 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (9) |
| open_studio/random-29 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (5) |
| sunlit_living_room/random-0 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (8) |
| sunlit_living_room/random-1 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:wall* | - | fail (12) |
| sunlit_living_room/random-2 | test | pass | table:table ridge:table* sea:floor gate:door window:wall art* | - | fail (11) |
| sunlit_living_room/random-3 | test | pass | table:table ridge:couch sea:floor gate:door window:wall art* | - | fail (7) |
| sunlit_living_room/random-4 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (12) |
| sunlit_living_room/random-5 | test | pass | table:table ridge:table* sea:floor gate:wall art* window:wall art* | - | fail (13) |
| sunlit_living_room/random-6 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (9) |
| sunlit_living_room/random-7 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (6) |
| sunlit_living_room/random-8 | test | pass | table:floor* ridge:floor* sea:floor gate:door window:wall* | - | fail (8) |
| sunlit_living_room/random-9 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (9) |
| sunlit_living_room/random-10 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (12) |
| sunlit_living_room/random-11 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (8) |
| sunlit_living_room/random-12 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (11) |
| sunlit_living_room/random-13 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (10) |
| sunlit_living_room/random-14 | test | pass | table:couch* ridge:couch* sea:floor gate:wall art* window:window | - | fail (10) |
| sunlit_living_room/random-15 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (8) |
| sunlit_living_room/random-16 | test | pass | table:table ridge:couch sea:floor gate:wall* window:window | - | fail (5) |
| sunlit_living_room/random-17 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (7) |
| sunlit_living_room/random-18 | test | pass | table:table ridge:table* sea:floor gate:wall* window:wall art* | - | fail (11) |
| sunlit_living_room/random-19 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (10) |
| sunlit_living_room/random-20 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (12) |
| sunlit_living_room/random-21 | test | pass | table:table ridge:couch sea:floor gate:door window:window | - | fail (12) |
| sunlit_living_room/random-22 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall art* | - | fail (6) |
| sunlit_living_room/random-23 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (9) |
| sunlit_living_room/random-24 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (7) |
| sunlit_living_room/random-25 | test | pass | table:table ridge:couch sea:floor gate:wall* window:wall* | - | fail (7) |
| sunlit_living_room/random-26 | test | pass | table:table ridge:couch sea:floor gate:door window:wall* | - | fail (12) |
| sunlit_living_room/random-27 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (8) |
| sunlit_living_room/random-28 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (12) |
| sunlit_living_room/random-29 | test | pass | table:table ridge:couch sea:floor gate:wall art* window:window | - | fail (10) |
