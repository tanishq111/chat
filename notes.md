```
POST /api/auth/login HTTP/1.1          ← METHOD + PATH
Host: localhost:3000
Content-Type: application/json          ← HEADERS (metadata about the request)
Authorization: Bearer eyJhbGci...
                                        ← blank line
{ "email": "a@x.com", "password": "…" } ← BODY (the payload)
```




```
2xx  — it worked
  200 OK                 normal success
  201 Created            we made something new (register, send message)
  204 No Content         success, deliberately nothing to return (delete)

4xx  — YOU (the client) made a mistake
  400 Bad Request        malformed / failed validation
  401 Unauthorized       "I don't know who you are"       ← no / bad token
  403 Forbidden          "I know who you are, and no"     ← not a participant
  404 Not Found          no such route or resource
  409 Conflict           duplicate — email already exists

5xx  — WE (the server) made a mistake
  500 Internal Server Error    something threw and we didn't expect it
```




      SQL (MySQL/Postgres)          MongoDB
      ────────────────────          ────────────────────
      Database                      Database
        └─ Table                      └─ Collection
             └─ Row                        └─ Document   (BSON — JSON-like)
                  └─ Column                     └─ Field
      JOIN                          $lookup / populate
      Schema enforced by the DB     Schema enforced by YOUR APP






```
users collection — what Mongo allows with no schema:
{ username: "alice", email: "a@x.com", password: "..." }
{ user_name: "bob",  mail: "b@x.com" }          ← different keys!
{ banana: true }                                 ← Mongo: "sure, fine"
```




| | JSON | BSON |
|---|---|---|
| Format | text | binary |
| Numbers | one `number` type | `Int32`, `Int64`, `Double`, `Decimal128` |
| Dates | strings | a real `Date` type |
| Binary data | base64 strings | native `Binary` |
| Extras | — | `ObjectId` |




```
_id
: 
ObjectId('6a8f1962e597c66669fb1456')

ObjectId
conversation
: 
6a8f0f2e83a1fce0accad7fa

ObjectId
sender
: 
6a8f0c05d690c4ae02994206

ObjectId
text
: 
hey how are you

String
status
: 
delivered

String
createdAt
: 
2026-08-26T16:50:42.493+00:00



Date
updatedAt
: 
2026-09-04T15:50:41.173+00:00



Date
__v
: 
0

```













```
┌──────────────────────┬────────────────────────────────────┐
│  SIDEBAR             │  CHAT WINDOW                       │
│                      │                                    │
│  [A] Alice           │   Bob:    hey                 9:01 │
│      "see you"  9:04 │   Alice:  hi                  9:02 │
│  ─────────────────   │   Bob:    you free?           9:03 │
│  [C] Charlie         │   Alice:  see you             9:04 │
│      "ok"       8:30 │                                    │
│                      │   ┌──────────────────────┐ [Send]  │
│                      │   │ Type a message...    │         │
└──────────────────────┴────────────────────────────────────┘
```






```
┌──────────────────────── App ────────────────────────┐
│ ┌──────── Header ────────────────────────────────┐  │
│ │  Logo        SearchBar        Avatar           │  │
│ └────────────────────────────────────────────────┘  │
│ ┌── Sidebar ──┐ ┌────────── VideoGrid ──────────┐   │
│ │  NavItem    │ │  VideoCard  VideoCard  Video… │   │
│ │  NavItem    │ │  VideoCard  VideoCard  Video… │   │
│ └─────────────┘ └───────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```



```
index.html (<div id="root">)  →  main.jsx (createRoot + render)  →  App.jsx  →  everything else
```


```
<ProfileCard
  name="Tanishq"                                   // string
  age={25}                                         // number
  isOnline={true}                                  // boolean
  skills={["React", "Node", "MongoDB"]}            // array
  address={{ city: "Pune", country: "India" }}     // object
  onGreet={() => alert("Hi!")}                     // function
/>
```





```
WITHOUT memo              WITH memo
Parent ✅ re-renders      Parent ✅ re-renders
  └─ Child ✅ re-renders    └─ Child ⛔ SKIPPED (props identical)
       └─ GrandChild ✅          └─ GrandChild ⛔ also skipped — the whole subtree
```



```

| | `useState` | `useRef` |
|---|---|---|
| Survives re-renders | ✅ | ✅ |
| Changing it re-renders | ✅ | ❌ |
| Read during render | ✅ safe | ⚠️ avoid |
| Use for | anything the user **sees** | things the user **doesn't see** |

```



```
        App
       /    \
  SearchBar  ResultsList      ← SearchBar knows the query.
                                ResultsList needs it. They can't talk.
```




```
buy now -> signup page -> payment -> done
when going back without replace:true
buy now <- signup page <- payment 
with replace:true
buy now <- payment 
```



```
register controller runs
        ↓
MongoDB operation fails
        ↓
controller Promise is rejected
        ↓
.catch(next) receives the error
        ↓
next(error) is called
        ↓
Express sends it to errorHandler
        ↓
client receives a consistent error response
```



```
Refresh token
User -> /cart (jwt) -> backend -> jwt expired -> call backend with refresh token -> backend -> new token + new refresh -> /cart(new jwt) -> suceess
```

```

  USERS                CONVERSATIONS              MESSAGES
  ─────                ─────────────              ────────
  _id        ◄──┐      _id                        _id
  username      ├───── participants: [ ]          conversationId ──┐
  email         │      isGroup                    sender ──────────┘
  password      │      name                       text
  lastSeen      └───── lastMessage ──────────►    status
                                                  createdAt

```



```
{
  _id: ObjectId("..."),
  participants: [ObjectId("A"), ObjectId("B")],
  messages: [
    { sender: ObjectId("A"), text: "hey",      createdAt: ... },
    { sender: ObjectId("B"), text: "hey back", createdAt: ... },
    // ... 40,000 more
  ]
}

```

```
Tanishq opens a chat with Alice  →  creates Conversation #1
Tanishq closes the tab, opens a chat with Alice again
                                 →  creates Conversation #2  ✗
```


```
{
  isGroup: false,
  participants: { $all: [me, them], $size: 2 }
}
```


```
request → protect ──────────────→ controller ──────────→ response
          knows WHO              knows WHO and WHAT
          (401 lives here)       (403 lives here)
```




```
CLIENT                          SERVER
  │                               │
  ├──── GET /api/messages ───────►│
  │                               │  (thinks)
  │◄─────── 200 + JSON ───────────┤
  │                               │
  ✕ connection closed             │
```








```http
GET /socket.io/ HTTP/1.1
Host: localhost:3000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
```


```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```



```
CLIENT                          SERVER
  │                               │
  ├──── HTTP GET + Upgrade ──────►│
  │◄──── 101 Switching ───────────┤
  │═══════ open forever ══════════│
  │◄────── "new message" ─────────┤   ← server speaks first
  ├─────── "typing..." ──────────►│
  │◄────── "user joined" ─────────┤
```


```
chatApp

client.to -> chatApp "hi how are you" while senging
clinet.on -> chatApp while receiving
server -> chatApp "hello"
```


```
TAB A                           SERVER                          TAB B
  │                                │                              │
  │ user types "hey" + Enter       │                              │
  │                                │                              │
  │ socket.emit('message:send',    │                              │
  │              'hey')  ────────► │                              │
  │                                │ socket.on('message:send')    │
  │                                │   fires — this is A's socket │
  │                                │                              │
  │                                │ builds {                     │
  │                                │   id:   '8f3c-...'           │
  │                                │   from: 'kT9b'  ← from       │
  │                                │           socket.id, not     │
  │                                │           from the client    │
  │                                │   text: 'hey'                │
  │                                │   at:   1760...              │
  │                                │ }                            │
  │                                │                              │
  │                                │ io.emit('message:new', msg)  │
  │ ◄──────────────────────────────┼─────────────────────────────►│
  │                                │                              │
  │ socket.on('message:new')       │        socket.on('message:new')
  │ write("[2:14 PM] kT9b: hey")   │        write("[2:14 PM] kT9b: hey")
  │                                │                              │
```



```
   Ananya's browser                 SERVER                     Rahul's browser
         │                             │                             │
         │  POST /api/messages ──────► │                             │
         │                             │ protect → validate → save   │
         │                             │                             │
         │  ◄──── 201 { message }      │                             │
         │                             │                             │
         │                             │ io.to(convId)               │
         │                             │   .emit('message:new') ───► │  renders instantly
         │  ◄──────────────────────────┤                             │
         │   (also gets it — same      │                             │
         │    object, so no drift)     │                             │

```



```
┌──────────────┬────────────────────────────┐
│  SIDEBAR     │  HEADER (who you're with)  │
│              ├────────────────────────────┤
│ conversation │                            │
│ conversation │     MESSAGE LIST           │
│ conversation │     (scrolls)              │
│              │                            │
│ [search]     ├────────────────────────────┤
│              │  [ type a message...  ][>] │
└──────────────┴────────────────────────────┘

```


```
ChatPage
├── Sidebar
│   ├── UserSearch
│   └── ConversationItem   (xN)
└── ChatWindow
    ├── ChatHeader
    ├── MessageList
    │   └── MessageBubble  (xN)
    └── MessageInput

```













