var ExcerciseListHelper = {
    add: function(ind, exercise) {       
        var $html = $($('#template-form-exercise').clone().html());
        $html.find('.data-exercise-name').val(exercise.name);
        $html.find('.data-exercise-sets').val(exercise.sets);
        $html.find('.data-exercise-repetitions').val(exercise.repetitions);
        $item = $('<div class="input-exercice"  data-exercise-index="'+ ind +'"></div>');
        $item.append($html);
        $('#form-save-workout .list-exercise').append($item);
    },
    removeAll: function() {
        $('#form-save-workout .list-exercise').html('');
    }
};
var WorkoutForm =  {
    workout: null,
    maxExerciseIndex: -1,
    _save: function() {
        var self = this;
        if ( App.isSaving() ) {
            setTimeout(
                function() {
                    self._save();
                },
                2000
            );
            return;
        }
        if ( self.workout == null ) {
            return;
        }
        App.saveWorkout(self.workout);
    },
    _addExercise: function() {
        var self = this;
        var exercise = new Exercise();
        var idx = parseInt(this.maxExerciseIndex) + 1;
        this.maxExerciseIndex = idx;
        this.workout.exercises[idx] = exercise;
        ExcerciseListHelper.add(idx, exercise);
        self._save();
    },
    _removeExercise: function(index) {
        var self = this;
        delete this.workout.exercises[index];
        self._save();
    },
    show: function(workout) {
        this.workout = workout;
        $('#index').hide();
        $('#form-save-workout').show();
        $('#form-save-workout .data-workout-active').prop('checked', workout.active);
        $('#form-save-workout .data-workout-name').val(workout.name);
        var template = $('#template-form-exercise');
        var $html;
        ExcerciseListHelper.removeAll();
        for (ind in workout.exercises ) {
            ExcerciseListHelper.add(ind, workout.exercises[ind]);
            if ( ind > this.maxExerciseIndex ) {
                this.maxExerciseIndex = ind;
            }
        }
    },
    goBack: function() {
        this.workout = null;
        $('#index').show();
        $('#form-save-workout').hide();
        $('#modal-confirm-remove-workout').hide();
    },
    init: function() {
        var self = this;
        $('#add-exercise').click(function() {
            self._addExercise();
        });
        $('#confirm-remove-workout').click(function(){
            $('#modal-confirm-remove-workout').show();
        });

        $('#modal-confirm-remove-workout button').click(function(){
            $('#modal-confirm-remove-workout').hide();
        });

        $('#remove-workout').click(function() {
            if ( self.workout != null ) {
                App.removeWorkout(self.workout.id);
                self.workout = null;
            } else {                
                App.listWorkouts();
                self.goBack();
            }
        });

        $('#form-save-workout').on('click', '.remove-exercise', function() {
            var target = $(this).parent().parent();
            var index = $(target).attr('data-exercise-index');
            $(target).remove();
            self._removeExercise(index);
        });

        $('#form-save-workout').on('change', '.data-exercise-name', function() {
            var target = $(this).parent().parent().parent().parent();
            var index = $(target).attr('data-exercise-index');
            self.workout.exercises[index].name = $(this).val();
            self._save();
        });

        $('#form-save-workout').on('change', '.data-exercise-sets', function() {
            var target = $(this).parent().parent().parent().parent();
            var index = $(target).attr('data-exercise-index');
            self.workout.exercises[index].sets = $(this).val();
            self._save();
        });

        $('#form-save-workout').on('change', '.data-exercise-repetitions', function() {
            var target = $(this).parent().parent().parent().parent();
            var index = $(target).attr('data-exercise-index');            
            self.workout.exercises[index].repetitions = $(this).val();
            self._save();
        });

        $('#form-save-workout .data-workout-active').change(function() {
            self.workout.active = $(this).is(":checked") ? 1 : 0;
            self._save();
        });
        $('#form-save-workout .data-workout-name').change(function() {
            self.workout.name = $(this).val();
            self._save();
        });
    }
};
var WorkoutHelper = {
    removeAllHtmlItems: function() {
        $('#workout-list article div.items div').html('');
    },
    addHtmlListItem: function(workout) {
        var $html = $("#template-item-workout").clone();
        $html.find('.text-workout-name').text(workout.name);

        if ( workout.lastDate != null ) {
        
            $html.find('.text-workout-last-date').text(
                "Treinou em: " +
                workout.lastDate.getDate() + "/" +
                (workout.lastDate.getMonth() + 1) + "/" +
                workout.lastDate.getFullYear()
            );
        }
        $html.find('.edit-workout').attr('data-workout-id', workout.id);
        $html.find('.do-workout').attr('data-workout-id', workout.id);
        
        if ( parseInt(workout.active) == 1 ) {
            $('#workout-list article div.active-items div').append($html.html());
        } else {
            $('#workout-list article div.inactive-items div').append($html.html());
        }
    },
    showWorkingout: function(workout) {
        $('#working-out article ul');
        var $template = $('#template-text-exercise');
        var $html;
        var exercise;
        $('#working-out article .text-workout-name').text(workout.name);
        $('#working-out article ul').html('');
        for ( ind in workout.exercises ) {
            $html = $($template.clone().html());
            exercise = workout.exercises[ind];
            $html.find('.text-exercise-name').text(exercise.name);
            $html.find('.text-exercise-sets').text("Series: " + exercise.sets);
            $html.find('.text-exercise-repetitions').text("Rep: " + exercise.repetitions);            
            $('#working-out article ul').append($html);
        }
        $('#index').hide();
        $('#working-out').show();
        workout.lastDate = new Date();
        App.saveWorkout(workout);        
    },
    init: function() {
        var self = this;
        $('#workout-list article').on("click", ".edit-workout", function() {
            var id = $( this ).attr('data-workout-id');
            App.editWorkout(id);
        });

        $('#workout-list article').on("click", ".do-workout", function() {
            var id = $( this ).attr('data-workout-id');
            App.doWorkout(id);
        });

        $('#new-workout').click(function() {
            App.addWorkout();
        });

        $('#btn-input-form-back').click(function(){
            App.listCurrentWorkouts();
            WorkoutForm.goBack();
        });

        $('#btn-working-out-back').click(function(){
            $('#index').show();
            $('#working-out').hide();      
        });

        $('.show-active-workouts').click(function() {
            $('#workout-list article div.active-items').show();
            $('#workout-list article div.inactive-items').hide();
        });

        $('.show-inactive-workouts').click(function() {
            $('#workout-list article div.active-items').hide();
            $('#workout-list article div.inactive-items').show();
        });

        $('#workout-list article div.inactive-items').hide();
    }
};