import fetch from "node-fetch";

const data = await fetch('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=027b9834ffb45f21222f6cb50bd3');
const response = await data.json();

const userInfoMap = {};

response.users.forEach(user => {
    userInfoMap[user.id] = { ...user };
    delete userInfoMap[user.id].id;
});

const sortedMessages = response.messages.sort((a, b) => b.timestamp - a.timestamp);
const myUsersConversations = {};

sortedMessages.forEach(convo => {
    const otherPartyId = convo.fromUserId === response.userId ? convo.toUserId : convo.fromUserId;

    if (!myUsersConversations.hasOwnProperty(`x${otherPartyId}`)) {
        myUsersConversations[`x${otherPartyId}`] = {
            ...userInfoMap[otherPartyId],
            mostRecentMessage: {
                "content": convo.content,
                "timestamp": convo.timestamp,
                "userId": convo.fromUserId
            },
            totalMessages: 1,
            userId: otherPartyId
        }
    } else {
        myUsersConversations[`x${otherPartyId}`].totalMessages += 1;
    }
});

const postData = await fetch('https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=027b9834ffb45f21222f6cb50bd3', {
    method: 'post',
    body: JSON.stringify({ conversations: Object.values(myUsersConversations) }),
    headers: {'Content-Type': 'application/json'} 
});

const postResponse = await postData.json();

console.log(postResponse);