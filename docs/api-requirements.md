# AVM API Requirements Documentation

## 1. Video Posts API

### GET /api/video-posts
List videos with pagination and filters

**Query Parameters:**
```
page: number (default: 0)
size: number (default: 10)
sort: string (default: "createdDate,desc")
tag: string[] (filter by tags)
uploadedById: string (filter by uploader)
creatorId: string (filter by creator)
campaignId: string (filter by campaign)
status: string (filter by status)
searchQuery: string (search in title, description)
```

**Tags Options:**
- latest
- popular
- trending
- comedy
- most_recent
- top_voted
- [other category tags]

**Response Changes:**
1. Basic Video Information:
   - Video ID, title, description
   - URL and thumbnail URL
   - Tags array
   - Status field
   - View/like/dislike counts

2. Shortlist Status:
   - Added isShortlisted object mapping campaignIds to boolean values
   - Example: `"isShortlisted": {"campaign123": true, "campaign456": false}`

3. Creator Details:
   - Creator ID
   - Username
   - Profile picture URL

4. Campaign Information:
   - Campaign ID and title
   - Sponsor details (id, name, logo)

5. Metadata:
   - Creation date
   - Last update date

**Response Structure:**
```json
{
  "content": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "thumbnailUrl": "string",
      "tags": ["string"],
      "status": "string",
      "likes": number,
      "dislikes": number,
      "views": number,
      "isShortlisted": {
        "campaignId1": boolean,
        "campaignId2": boolean
      },
      "creator": {
        "id": "string",
        "username": "string",
        "profilePicture": "string"
      },
      "campaign": {
        "id": "string",
        "title": "string",
        "sponsor": {
          "id": "string",
          "name": "string",
          "logo": "string"
        }
      },
      "createdDate": "string",
      "updatedDate": "string"
    }
  ],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number
}
```

### POST /api/video-posts/{videoId}/shortlist
Shortlist a video for a campaign

**Request Body:**
```json
{
  "campaignId": "string",
  "isShortlisted": boolean,
  "updatedBy": "string"
}
```

## 2. Campaigns API

### GET /api/campaigns
List campaigns with pagination and filters

**Query Parameters:**
```
page: number (default: 0)
size: number (default: 10)
sort: string (default: "createdDate,desc")
sponsorId: string (filter by sponsor)
adminId: string (filter by admin)
searchQuery: string (search in title, description)
status: string (filter by status)
isActive: boolean
```

**Response:**
```json
{
  "content": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "startDate": "string",
      "endDate": "string",
      "status": "string",
      "isActive": boolean,
      "sponsor": {
        "id": "string",
        "name": "string",
        "logo": "string",
        "website": "string"
      },
      "admin": {
        "id": "string",
        "username": "string"
      },
      "submissionCount": number,
      "shortlistedCount": number,
      "createdBy": "string",
      "createdDate": "string",
      "updatedBy": "string",
      "updatedDate": "string"
    }
  ],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number
}
```

### GET /api/campaigns/{id}
Get campaign details

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "status": "string",
  "isActive": boolean,
  "sponsor": {
    "id": "string",
    "name": "string",
    "logo": "string",
    "website": "string",
    "description": "string"
  },
  "admin": {
    "id": "string",
    "username": "string",
    "email": "string"
  },
  "submissions": {
    "total": number,
    "shortlisted": number,
    "pending": number
  },
  "timeline": [
    {
      "status": "string",
      "date": "string",
      "updatedBy": "string",
      "remarks": "string"
    }
  ],
  "createdBy": "string",
  "createdDate": "string",
  "updatedBy": "string",
  "updatedDate": "string"
}
```

## 3. Sponsors/Brands API

### GET /api/sponsors
List sponsors with pagination and filters

**Query Parameters:**
```
page: number (default: 0)
size: number (default: 10)
sort: string (default: "name,asc")
adminUserIds: string[] (filter by admin users)
searchQuery: string (search in name, description)
status: string (filter by status)
```

**Response:**
```json
{
  "content": [
    {
      "id": "string",
      "name": "string",
      "logo": "string",
      "website": "string",
      "description": "string",
      "status": "string",
      "adminUsers": [
        {
          "id": "string",
          "username": "string",
          "email": "string"
        }
      ],
      "campaignCount": number,
      "createdBy": "string",
      "createdDate": "string",
      "updatedBy": "string",
      "updatedDate": "string"
    }
  ],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number
}
```

## 4. Video Users API Clarification

### User Types and Roles
1. **Admin Users**
   - Can manage campaigns, sponsors, and videos
   - Can shortlist videos
   - Can view all analytics

2. **Creator Users**
   - Can upload videos
   - Can participate in campaigns
   - Can view their own analytics

3. **Regular Users**
   - Can view public videos
   - Can like/dislike videos
   - Cannot participate in campaigns

### User-Related APIs Required

1. **GET /api/users**
   - List users with role-based filtering
   - Pagination support
   - Search by username/email

2. **GET /api/users/{id}/videos**
   - List videos uploaded by a specific user
   - Pagination support
   - Filter by status/campaign

3. **GET /api/users/{id}/campaigns**
   - List campaigns associated with a user
   - Different views for admin vs creator
   - Pagination support

4. **GET /api/users/{id}/analytics**
   - Get user-specific analytics
   - View counts, like counts, submission counts
   - Campaign participation stats
