var App = new function(){
    var _workouts = [];
    var _saving = false;

    var _listWorkouts = function() {
        _workouts = [];
        WorkoutHelper.removeAllHtmlItems();
        if (!AppDataBase.db()) {                    
            setTimeout(_listWorkouts, 1000);
            return;
        }
        AppModel.getAll(function(workout) {
            _workouts[workout.id] = workout;
            WorkoutHelper.addHtmlListItem(workout);
        }); 
    };

    var _listCurrentWorkouts = function() {
        WorkoutHelper.removeAllHtmlItems();
        for ( ind in _workouts ) {
            WorkoutHelper.addHtmlListItem(_workouts[ind]);
        } 
    };

    var _doWorkout = function(id) {
        WorkoutHelper.showWorkingout(_workouts[id]);
    };

    var _isSaving = function() {
        return _saving == true;
    }

    var _saveWorkout = function(workout) {
        _saving = true;
        AppModel.save(
            workout,
            function(id) {
                _saving = false;
                workout.id = id;
                _workouts[id] = workout;
            },
            function() {
                _saving = false;
                alert('Falha ao salvar o treino');
            }
        );
    };

    var _editWorkout = function(id) {
        WorkoutForm.show(_workouts[id]);
    };

    var _addWorkout = function() {
        WorkoutForm.show(new Workout());
    };
    var _removeWorkout = function (id) {
        AppModel.remove(
            id,
            function() {                
                _listWorkouts();
                WorkoutForm.goBack();
            }, 
            function() {
                alert('Falha ao remover o treino');                         
                _listWorkouts();
                WorkoutForm.goBack();
            }
        );
    };
    var _init = function() {
        AppDataBase.init(
            function() {
                _listWorkouts();
            },
            function() {
                alert('Falha ao criar base, tente atualizar o app');
            }
        );
        WorkoutForm.init();
        WorkoutHelper.init();
    }

    return {
        init: _init,
        addWorkout: _addWorkout,
        doWorkout: _doWorkout,
        editWorkout: _editWorkout,
        listCurrentWorkouts: _listCurrentWorkouts,
        listWorkouts: _listWorkouts,        
        removeWorkout: _removeWorkout,
        saveWorkout: _saveWorkout,
        isSaving: _isSaving       
    }
};
$(document).ready(function(){
    App.init();
});