import 'phaser';

import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import FightScene from './scenes/FightScene';
import MenuScene from './scenes/MenuScene';
import OptionsScene from './scenes/OptionsScene'

// For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
const config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 1600,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        FightScene,
        MenuScene,
        OptionsScene
    ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
