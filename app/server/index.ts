require('./Auth/sLogin');
require('./Auth/sRegister');
require('./Chat');
require('./Vehicle');

import ChatMisc from './Chat/ChatMisc';
import Logger from './Options/sLogger';

mp.events.addCommand({
    'pos': (player: PlayerMp) => {
        if (ChatMisc.notLoggedError(player)) {
            return;
        }

        const pos = player.position;
        let rot;
        if (player.vehicle) rot = player.vehicle.rotation.z
        else rot = player.heading;
        const str = `x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, rot: ${rot}, dim: ${player.dimension}`;
        player.outputChatBox(str);
    },

    'respawn': (player: PlayerMp) => {
        if (ChatMisc.notLoggedError(player)) {
            return;
        }

        if (!player.dead) {
            player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + ` You need to be dead to respawn!`);
        } else {
            player.spawn(player.position);
            player.health = 100;
            // player.tp(tp);
            player.outputChatBox(ChatMisc.insertColorAndTimeStamp('lightgreen') + ` Respawned!`);
            Logger.debug(`${player.name} respawned!`);
            player.dead = false;
        }
    },

    'skin': (player: PlayerMp, fullText: string) => {
        if (ChatMisc.notLoggedError(player)) {
            return;
        }

        if (fullText) {
            if (player.dead) {
                player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + ` You need to be alive to change your skin!`);
            } else {
                if (player.setSkin(fullText)) {
                    player.outputChatBox(ChatMisc.insertColorAndTimeStamp('lightgreen') + ` Skin changed! New skin: ${fullText.trim().toUpperCase()} (ID: ${player.model})`);
                } else {
                    player.outputChatBox(ChatMisc.insertColorAndTimeStamp('darkred') + ` Skin not found, try again!`);
                }
            }
        } else {
            player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + `USAGE: /skin <number | text>`);
        }
    },
});

mp.events.add({
    "playerDeath": (player: PlayerMp, reason: number, killer: PlayerMp) => {

        if (killer) {
            Logger.debug(`${player.name} death! Reason: ${reason}, killer: ${killer.name}`);
        } else {
            Logger.debug(`${player.name} death! Reason: ${reason}`);
        }

        player.dead = true;
        player.outputChatBox(ChatMisc.insertColorAndTimeStamp('darkred') + ` You died! Use /respawn whenever you're ready.`);
    }
});
