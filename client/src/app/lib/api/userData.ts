export async function userData(userId: string, sessionId: string) {
  const queryParams = new URLSearchParams({
    user_id: userId,
    session_id: sessionId,
  });

  const response = await fetch(`http://localhost:5000/api/v1/blockgpt/user-session-data?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to get user session data");
  }

  const data = await response.json()
  return data.service_output;
}