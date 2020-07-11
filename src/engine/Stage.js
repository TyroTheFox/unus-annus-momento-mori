import * as backgroundData from '../../assets/backgroundManifest.json';

export default class Stage {
    constructor( scene, stageName, folderName ) {
        this._name = stageName;
        this._scene = scene;
        this._folderName = folderName;

        this._components = {};

        const stageData = backgroundData.find( data => data.folderName === this._folderName );
        const stageComponents = stageData.components;

        stageComponents.forEach( ( componentData ) => {
            let x = 0;
            let y = 0;

            switch ( componentData.position ) {
                case 'center':
                    x = scene.game.config.width / 2;
                    y = scene.game.config.height / 2;
                    break;
                case 'absolute':
                    x = componentData.x;
                    y = componentData.y;
                    break;
            }

            this._components[componentData.name] = this._scene.add.sprite( x, y, `${componentData.name}_${folderName}`).play( `${componentData.name}_${folderName}` );

            if ( componentData.scale ) {
                this._components[componentData.name].setScale( componentData.scale );
            }

            if ( componentData.alpha ) {
                this._components[componentData.name].alpha = componentData.alpha;
            }

            if ( componentData.anchor ) {
                this._components[componentData.name].setOrigin( componentData.anchor.x, componentData.anchor.y );
            }
        } );
    }
}
