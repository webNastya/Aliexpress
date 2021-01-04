$(function () {
  if ($("#errors").text() != "") {
    $("#loginPage").hide();
    $("#regPage").show();
  }
  $("#1").click(function () {
    $("#loginPage").show();
    $("#regPage").hide();
  });
  $("#2").click(function () {
    $("#loginPage").hide();
    $("#regPage").show();
  });
});
