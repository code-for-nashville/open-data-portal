# Data Source
- This data was originally published on Nashville Metro's [open-data-portal].
- However, they only keep the latest quarter, so I had to request the history.
- The raw-xlsx were sent as attachments in a public records request email.
- The csv's are simply the raw-xlsx converted from xlsx (and renamed for brevity).
- The `quarterly` csv has the whole history in a single csv.

# Concerns
- Some files came with an additional County Field (last column). Those have been left blank where missing.
- Some files came with a `#` in the `Class Field` name (header only) and others with a `.`. 
- Otherwise, all files appear to have the same columns with same names etc.
- All files had 0-padded mm/dd/yyy dates except 2016-01, which dropped leading 0's.
- Quarters 2015-07, 2015-01 and all 2014 are missing.

