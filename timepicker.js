$(function() {
  $('input').parsley('validate');
  var timeInputs = $('input[data-time-input]');
    
  timeInputs.on('keyup', function(event) {
    $('.parsley-errors-list').hide();

    var time = $(this).val();
    var backspaceKeyCode = 186;
    var enterKeyCode = 13;

    if (event.which == backspaceKeyCode) {
      colonCount = time.split(':');
      //Only one colon is allowed according to the min:sec format, so remove any extra ones as the user types.
      if (colonCount.length > 2) {
        this.value = colonCount.slice(0, 2).join(':');
      }
    }

    if (event.which == enterKeyCode) {
      $('.parsley-errors-list').show();

      var time = $(this).val();
      var digitCount = time.length;
      var totalSeconds = 0;

      //Check if user has already added colon.
      if (time.indexOf(':') == -1) {
        //If one or two digits, append seconds field. Example 12 -> 12:00 and 5 -> 5:00
        if (digitCount == 1 || digitCount == 2) {
          totalSeconds = time * 60;
          $(this).val(time + ':00');
        }
        else if (digitCount > 2) {
          //If 3 digits, add colon after first digit. Example 500 -> 5:00
          //If 4 digits, add it after second digit. Example 1200 -> 12:00
          var index = digitCount - 2;
          totalSeconds = parseInt(time.substr(0, index) * 60) + parseInt(time.substr(index));
          time = time.substr(0, index) + ':' + time.substr(index);
          $(this).val(time);
        }
      }
      else {
        //If user entered colon, tweak it to fit format.
        var index = time.indexOf(':');
        var minutes = (time.substr(0, index));
        var seconds = (time.substr(index + 1));

        //Example 1:3 -> 1:30
        if (seconds.length == 1) {
          seconds = seconds + '0';
          $(this).val(time + '0');
        }
        //Example :30 -> 00:30
        else if (minutes.length == 0) {
          minutes = minutes + '00';
          $(this).val('00' + time);
        }
        totalSeconds = parseInt(minutes * 60) + parseInt(seconds);
      }
      $(this).nextAll('input[type=hidden]').first().val(totalSeconds);
    }
  });

  window.ParsleyValidator.addValidator('regex', function(value, requirement) {
    //This checks if time is set to less than 5 seconds.
    var minimumTime = /^(0?0:0[0-4]?)$/;
    //This checks if time is of min:sec format with at least 3 digits and maximum value of 59:59.
    var timeFormat = /^(([0-5]?[0-9]:)?[0-5][0-9]?)$|^([0-9]:[0-9]{2}?)$/;

    if (value.match(minimumTime)) {
      return false;
    }
    if (!value.match(timeFormat)) {
      return false;
    }
    return true;
  }, 32)
  .addMessage('en', 'regex', "Please enter a valid input in min:sec. Maximum of 59:59 and minimum of 00:05");
});
