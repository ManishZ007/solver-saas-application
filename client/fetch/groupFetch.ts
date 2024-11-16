import {
  FETCH_CHAT_GROUPS_URL,
  GET_CHAT_GROUP_USERS,
  GET_CHAT_GROUP,
  GET_ALL_CHATS,
  GET_ALL_EVENT,
  FETCH_ALL_POSTS,
  FETCH_USER_POST,
  // FETCH_ALL_USER_RATING,
} from "@/lib/apiEndPoints";

export async function fetchChatGroup(id: string) {
  const res = await fetch(FETCH_CHAT_GROUPS_URL + `/${id}`, {
    method: "GET",
    next: {
      revalidate: 60 * 60,
      tags: ["chats"],
    },
  });

  if (!res.ok) {
    throw new Error("Faile to fetch data");
  }
  const response = await res.json();

  if (response?.data) {
    return response?.data;
  }

  return [];
}

export async function fetchGroupChat(id: string) {
  const res = await fetch(GET_CHAT_GROUP + `/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Faile to fetch data");
  }
  const response = await res.json();

  if (response?.data) {
    return response?.data;
  }

  return null;
}

export async function fetchChatGroupUsers(id: string) {
  const res = await fetch(`${GET_CHAT_GROUP_USERS}?group_id=${id}`, {
    method: "GET",
    next: {
      revalidate: 60 * 60,
      tags: ["chat-group-user"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}

export async function fetchAllChats(id: string) {
  const res = await fetch(`${GET_ALL_CHATS}?group_id=${id}`, {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }

  return [];
}

export async function fetchAllEvent(id: string) {
  const res = await fetch(`${GET_ALL_EVENT}?user_id=${id}`, {
    next: {
      revalidate: 60 * 60,
      tags: ["event"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const response = await res.json();

  if (response?.events) {
    return response?.events;
  }

  return [];
}

export async function fetchAllPosts() {
  const res = await fetch(`${FETCH_ALL_POSTS}`, {
    method: "GET",
    next: {
      revalidate: 60 * 60,
      tags: ["all-post"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const resposne = await res.json();

  if (resposne?.data) {
    return resposne?.data;
  }

  return [];
}

// export async function fetchAllUserRating(user_id: string) {
//   const res = await fetch(`${FETCH_ALL_USER_RATING}/${user_id}`, {
//     cache: "reload",
//   });

//   if (!res.ok) {
//     throw new Error("Falied to fetch data");
//   }

//   const response = await res.json();

//   if (response?.rating) {
//     return response.rating;
//   }

//   return [];
// }

export async function fetchUserPosts(user_id: string) {
  const res = await fetch(`${FETCH_USER_POST}?user_id=${user_id}`, {
    method: "GET",
    next: {
      tags: ["user_post"],
      revalidate: 60 * 60,
    },
  });

  if (!res.ok) {
    throw new Error("something went wrong!");
  }

  const response = await res.json();

  if (response.data) {
    return response.data;
  }

  return [];
}
