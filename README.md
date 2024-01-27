# you-are-el-shrinker
Node ts express server
api:
    - /${redirect-link} GET - redirects from the redirect link to the target site.

    - /api/create POST - create a new redirect link for the target site, sent in the request's body.

    - /api/edit/${id} PATCH - edits the redirect link of the object that has the matching id. New link sent in the request's body.

    - /api/analytics/most-redirected GET - returns a descending list of sites with the number of redirects for each.

    - /api/analytics/most-redirected/${amount} GET - returns a descending list of a certain number of sites (according to ${amount}) with the number of redirects for each.

    - /api/analytics/most-visited GET - returns a descending list of sites with the number of visits for each.

    - /api/analytics/most-visited/${amount} GET - returns a descending list of a certain number of sites (according to ${amount}) with the number of visits for each.

    - /api/analytics/last-visited GET - returns a descending list of sites with the most recent visit for each.

    - /api/analytics/last-visited/${amount} GET - returns a descending list of a certain number of sites (according to ${amount}) the most recent visit for each.

    - /api/analytics POST - returns the full statistics of the redirect link, sent in the request's body.
