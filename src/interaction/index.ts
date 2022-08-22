import type { VoiceConnection } from "@discordjs/voice"
import type { Client, CommandInteraction, Snowflake } from "discord.js"
import { Collection } from "discord.js"
import { join } from "./join"
import { leave } from "./leave"
import { record } from "./record"
import { upload } from "./uploadt"


export const interactionHandlers = new Collection<
  string,
  (
    interaction: CommandInteraction,
    recordable: Set<Snowflake>,
    client: Client,
    connection?: VoiceConnection,
  ) => Promise<void>
>()

interactionHandlers.set('join', join)
interactionHandlers.set('record', record)
interactionHandlers.set('leave', leave)
interactionHandlers.set('upload', upload)
