export async function createSession(req, res) {
  try {
    console.log("1. createSession started");

    const { problem, difficulty } = req.body;

    console.log("2. request body parsed");

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    console.log("3. user extracted", userId);

    if (!problem || !difficulty) {
      return res.status(400).json({
        message: "Problem and difficulty are required",
      });
    }

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    console.log("4. creating mongo session");

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    console.log("5. mongo session created");

    console.log("6. creating stream video call");

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    console.log("7. stream video created");

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    console.log("8. creating chat channel");

    await channel.create();

    console.log("9. channel created");

    return res.status(201).json({
      session,
    });

  } catch (error) {
    console.log("CREATE SESSION ERROR:");
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}