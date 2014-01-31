function Exercise ()
{
    this.name = '';
    this.sets = '';
    this.repetitions = '';
}

function Workout ()
{
    this.name = 'Novo treino';
    this.active = 1;
    this.lastDate = null;
    this.exercises = [];
}

AppModel = new function() {

    var _getAll = function(callbackRegistry) {
        var db = AppDataBase.db();
        var objectStore = db.transaction(AppDataBase.table).objectStore(AppDataBase.table);

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                callbackRegistry(cursor.value);
                cursor.continue();
            }
        };
    };

    var _remove = function(id, onSuccess, onError) {
        var db = AppDataBase.db();
        var transaction = db.transaction([AppDataBase.table], "readwrite");
        var request = transaction.objectStore(AppDataBase.table).delete(id);

        request.onsuccess = function (event) {
            if ( onSuccess != null ) {
                onSuccess(request.result);
            }
        };

        request.onerror = function (event) {
            if ( onError != null ) {
                onError(event);
            }
        };
    };

    var _save = function(workout, onSuccess, onError) {
        var db = AppDataBase.db();
        var transaction = db.transaction([AppDataBase.table], "readwrite");
        
        transaction.onerror = function (event) {
            if ( onError != null ) {
                onError(event);
            }
        };

        var objectStore = transaction.objectStore(AppDataBase.table);
        var request = objectStore.put(workout);
        request.onsuccess = function (event) {
            if ( onSuccess != null ) {
                onSuccess(request.result);
            }
        };
    };

    return {
        remove: _remove,
        getAll: _getAll,
        save: _save     
    };
};