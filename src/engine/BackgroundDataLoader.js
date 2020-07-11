import * as backgroundData from '../../assets/backgroundManifest.json';

export default class StageDataLoader {
    constructor( state ) {
        this._sourceDirectory = 'assets/backgrounds';
        this._game = state;
    }

    getAllStageData() {
        backgroundData.default.forEach( ( stage ) => {
            const folderName = stage.folderName;
            const stageComponents = stage.components;

            stageComponents.forEach( ( componentData ) => {
                this._game.load.atlas(
                    `${componentData.name}_${folderName}`,
                    `../../${this._sourceDirectory}/${folderName}/${componentData.name}/spritesheet.png`,
                    `../../${this._sourceDirectory}/${folderName}/${componentData.name}/atlas.json`);
                this._game.load.json( `animation_${componentData.name}_${folderName}`, `../../${this._sourceDirectory}/${folderName}/${componentData.name}/animation.json`);
            } );
        } );
    }

    createAllStages() {
        backgroundData.default.forEach( ( stage ) => {
            const folderName = stage.folderName;
            const stageComponents = stage.components;

            stageComponents.forEach( ( componentData ) => {
                const animationData = this._game.cache.json.get( `animation_${componentData.name}_${folderName}` )

                if ( animationData ) {
                    const animData = animationData.animData;
                    animData.key = `${componentData.name}_${folderName}`;
                    animData.frames = this._game.anims.generateFrameNames(`${componentData.name}_${folderName}`, animationData.frameConfig );
                    this._game.anims.create( animData );
                }
            } );
        } );
    }
}
