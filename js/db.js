var AppDataBase = new function () {

    var dbName = "sou_saude_workouts";
    var dbVersion = 1;
    var _table = 'workouts';

    var db;
    var request;
 
    var _init = function(whenOpen, whenNotOpen) {

        request = indexedDB.open(dbName, dbVersion);

        request.onerror = function (event) {
            whenNotOpen(event);
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            whenOpen(event);
        };

        request.onupgradeneeded = function (event) {

            db = event.target.result;
            if (!db.objectStoreNames.contains(_table)) {
                var objectStore = db.createObjectStore(_table, {
                    keyPath: "id",
                    autoIncrement: true
                });
                objectStore.createIndex("name", "name", {
                    unique: false
                });

                var sample = new Workout();
                sample.name = "A - Peitoral";
                sample.exercises[0] = new Exercise();
                sample.exercises[0].name = 'Supino Reto';
                sample.exercises[0].sets = 4;
                sample.exercises[0].repetitions = '12-10-8-6';

                sample.exercises[1] = new Exercise();
                sample.exercises[1].name = 'Supino declinado';
                sample.exercises[1].sets = 4;
                sample.exercises[1].repetitions = '10-10-8-6';

                sample.exercises[2] = new Exercise();
                sample.exercises[2].name = 'Flexao de braço';
                sample.exercises[2].sets = 4;
                sample.exercises[2].repetitions = '20';

                sample.exercises[3] = new Exercise();
                sample.exercises[3].name = 'Subino inclinado';
                sample.exercises[3].sets = 5;
                sample.exercises[3].repetitions = '8';

                objectStore.add(sample);
            }
        }
    }
    _db = function() {
        return db;
    };
    return {
        nome: "Marcelo Rocha",
        db: _db,
        init: _init,
        table: _table
    }
};