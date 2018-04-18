import Realm from 'realm';

const AccelerometerSchema = {
    name: 'Accelerometer',
    properties: {
        x: 'double',
        y: 'double',
        z: 'double'
    }
};

const GyroscopeSchema = {
    name: 'Gyroscope',
    properties: {
        x: 'double',
        y: 'double',
        z: 'double'
    }
};

const MagnetometerSchema = {
    name: 'Magnetometer',
    properties: {
        x: 'double',
        y: 'double',
        z: 'double'
    }
};

const PositionSchema = {
    name: 'Position',
    properties: {
        heading: 'double',
        speed: 'double'
    }
};

const MotionSchema = {
    name: 'Motion',
    primaryKey: 'id',
    properties: {
        id: 'int',
        accelerometer: 'Accelerometer',
        gyroscope: 'Gyroscope',
        magnetometer: 'Magnetometer',
        position: 'Position',
        activity: 'string'
    }
};

export default class Storage {
    
    static async setData(values) {

        let realm = await Realm.open({ schema: [AccelerometerSchema, GyroscopeSchema, MagnetometerSchema, PositionSchema, MotionSchema] })
        
        try {
            realm.write(() => {
                let id = realm.objects('Motion').max('id') || 0; 

                for (let value of values) {
                    id += 1;
                    realm.create('Motion', Object.assign({}, value, { id }));
                }
            });
        }
        catch (err) {
            console.log(err.message);
        }
    }

    static async getData() {

        let realm = await Realm.open({ schema: [AccelerometerSchema, GyroscopeSchema, MagnetometerSchema, PositionSchema, MotionSchema] })

        return realm.objects('Motion').sorted('id');
    }

    static async clearStorage() {
        
        let realm = await Realm.open({ schema: [AccelerometerSchema, GyroscopeSchema, MagnetometerSchema, PositionSchema, MotionSchema] })

        try {
            realm.write(() => {
                let motion = realm.objects('Motion');
                realm.delete(motion);
            });
        }
        catch (err) {
            console.log(err.message);
        }
    }
}