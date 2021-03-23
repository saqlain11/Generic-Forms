document.addEventListener("DOMContentLoaded", function () {
  var rightcard = false;
  var tempblock;
  var tempblock2;
  var formName;
  var data = {};
  var dataArr = [];
  var formCount = 1;
  document.getElementById("blocklist").innerHTML =
    '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">Form</p><p class="blockdesc">Drag & create form</p>';
  flowy(document.getElementById("canvas"), drag, release, snapping);
  function addEventListenerMulti(type, listener, capture, selector) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener(type, listener, capture);
    }
  }
  function snapping(drag, first) {
    var grab = drag.querySelector(".grabme");
    grab.parentNode.removeChild(grab);
    var blockin = drag.querySelector(".blockin");
    blockin.parentNode.removeChild(blockin);
    if (drag.querySelector(".blockelemtype").value == "1") {
      drag.innerHTML +=
        "<div  class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>Form" +
        formCount +
        "</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Dynamic <span>Form</span></div>";
      formCount++;
      dataArr = [];
    } else if (drag.querySelector(".blockelemtype").value == "7") {
      drag.innerHTML +=
        "<div class='blockyleft'><img src='assets/actionorange.svg'><p class='blockyname'>Perform an action</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Perform <span>Action 1</span></div>";
    }
    //   const order = drag.querySelector("#order");
    //   console.log({ order });
    return true;
  }
  function drag(block) {
    block.classList.add("blockdisabled");
    tempblock2 = block;
  }
  function release() {
    if (tempblock2) {
      tempblock2.classList.remove("blockdisabled");
    }
  }
  var disabledClick = function () {
    document.querySelector(".navactive").classList.add("navdisabled");
    document.querySelector(".navactive").classList.remove("navactive");
    this.classList.add("navactive");
    this.classList.remove("navdisabled");
    if (this.getAttribute("id") === "triggers") {
      document.getElementById("blocklist").innerHTML =
        '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">Form</p><p class="blockdesc">Drag & create form</p>        </div></div></div>';
    } else if (this.getAttribute("id") === "actions") {
      document.getElementById("blocklist").innerHTML =
        '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="7"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Perform an action</p><p class="blockdesc">Performs or edits a specified action</p>        </div></div></div>';
    }
  };
  addEventListenerMulti("click", disabledClick, false, ".side");
  document.getElementById("close").addEventListener("click", function () {
    if (rightcard) {
      rightcard = false;
      document.getElementById("properties").classList.remove("expanded");
      setTimeout(function () {
        document.getElementById("propwrap").classList.remove("itson");
      }, 300);
      tempblock.classList.remove("selectedblock");
    }
  });

  //   document.getElementById("removeblock").addEventListener("click", function () {
  //     flowy.deleteBlocks();
  //   });
  var aclick = false;
  var noinfo = false;
  var beginTouch = function (event) {
    aclick = true;
    noinfo = false;
    if (event.target.closest(".create-flowy")) {
      noinfo = true;
    }
  };
  var checkTouch = function (event) {
    aclick = false;
  };
  var doneTouch = function (event) {
    if (event.type === "mouseup" && aclick && !noinfo) {
      if (
        !rightcard &&
        event.target.closest(".block") &&
        !event.target.closest(".block").classList.contains("dragging")
      ) {
        tempblock = event.target.closest(".block");
        formName = tempblock.querySelector(".blockyname").innerHTML;

        document.getElementById("fName").value = formName;
        document.getElementById("inputVal").innerHTML = "";
        document.getElementById("fName").disabled = false;

        if (data.hasOwnProperty(formName)) {
          document.getElementById("fName").disabled = true;
          data[formName].map((data, index) => {
            document.getElementById("inputVal").innerHTML +=
              '<div class="card"><p style="align-self:center;">' +
              "Input label:" +
              (index + 1) +
              ") " +
              data.iType +
              " =>>> " +
              (index + 1) +
              ". " +
              data.iType +
              " Input" +
              "</p></div>";
          });
        }
        rightcard = true;
        if (tempblock.querySelector(".blockelemtype") !== "7") {
          document.getElementById("properties").classList.add("expanded");
          document.getElementById("propwrap").classList.add("itson");
          tempblock.classList.add("selectedblock");
        }
      }
    }
  };
  var submit = function (event) {
    var frm = document.getElementsByName("form")[0];
    var frmData = {};
    for (var i = 0; i < frm.elements.length - 2; i++) {
      frmData[frm.elements[i].id] = frm.elements[i].value;
    }
    dataArr.push(frmData);
    data[formName] = dataArr;
    frm.reset();
    document.getElementById("inputVal").innerHTML = "";

    data[formName].map((data, index) => {
      document.getElementById("inputVal").innerHTML +=
        '<div class="card"><p style="align-self:center;">' +
        "Input label:" +
        (index + 1) +
        ". " +
        data.iType + " Input" +
        "</p></div>";
    });
    document.getElementById("fName").disabled = true;
    alert("Field added to " + formName);
    console.log("Data,", data);
    return false;
  };
  var cancel = function (event) {
    var frm = document.getElementsByName("form")[0];
    frm.reset();
    document.getElementById("inputControls").style.display = "none";
    document.getElementById("formProperty").style.display = "block";

    return false;
  };
  var adddInput = function (event) {
    document.getElementById("inputControls").style.display = "block";
    document.getElementById("formProperty").style.display = "none";
  };
  var getFormName = function (event) {
    formName = event.target.value;
    tempblock.querySelector(".blockyname").innerHTML = formName;
  };

  document.getElementById("save").addEventListener("click", submit, false);
  document
    .getElementById("fName")
    .addEventListener("keyup", getFormName, false);

  document.getElementById("cancel").addEventListener("click", cancel, false);
  document
    .getElementById("addInput")
    .addEventListener("click", adddInput, false);

  // document.getElementsByClassName("blockelemtype").addEventListener("click", submit, false);

  addEventListener("mousedown", beginTouch, false);
  addEventListener("mousemove", checkTouch, false);
  addEventListener("mouseup", doneTouch, false);
  addEventListenerMulti("touchstart", beginTouch, false, ".block");
});
