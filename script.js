const isProduction = location.origin === "https://heymoral.herokuapp.com"

const $ = q => document.querySelector(q)

let ws = new WebSocket(isProduction ? "wss://heymoral.herokuapp.com/ws" : "ws://127.0.0.1:8765")

function sendObj(obj) {
  ws.send(JSON.stringify(obj))
}

function showScene(scene) {
  document.querySelectorAll(".scene").forEach(el => {
    if (el.getAttribute("data-scene") === scene) {
      el.setAttribute("data-active-scene", "")
    } else {
      el.removeAttribute("data-active-scene")
    }
  })
}

function setNavbar(left, right) {
  if (left) $("#nav-left").textContent = left
  $("#nav-right").textContent = right
}

function copyText(text) {
  let textbox = document.createElement("input")
  textbox.style.position = "fixed"
  textbox.style.top = "0"
  textbox.style.left = "0"
  textbox.style.opacity = "0"
  document.body.appendChild(textbox)

  textbox.value = text
  textbox.select()
  document.execCommand("copy")
  textbox.remove()
}

function addChatMessage(sender, content, color) {
  let msg = document.createElement("div")
  msg.title = "Sent " + (new Date()).toLocaleString()
  msg.className = "message"

  let senderText = document.createElement("b")
  senderText.textContent = sender + ": "
  senderText.style.color = color ? color : "#000000"

  let contentText = document.createTextNode(content)

  msg.appendChild(senderText)
  msg.appendChild(contentText)
  $("#message-list").appendChild(msg)

  $("#message-list").scrollTop = $("#message-list").scrollHeight - $("#message-list").clientHeight
}

function setUpPacks(packs) {
  return packs.map(pack => {
    let packLabel = document.createElement("label")
    packLabel.htmlFor = "select-pack-" + pack

    let packLabelText = document.createTextNode(pack)
    packLabel.appendChild(packLabelText)

    let packCheckbox = document.createElement("input")
    packCheckbox.type = "checkbox"
    packCheckbox.id = "select-pack-" + pack
    packLabel.appendChild(packCheckbox)
    $("#mr-packs").appendChild(packLabel)

    return { name: pack, checkbox: packCheckbox }
  })
}
let packs = setUpPacks(["Moral", "Relationships"])
let customQuestions = []
let customAnswers = []

function updateCustomCardsEditor() {
  $("#ayoc-questions").textContent = ""
  // $("#ayoc-answers").textContent = ""

  customQuestions.forEach((q, i) => {
    const questionRow = document.createElement("tr")

    const questionTextContainer = document.createElement("td")
    const questionText = document.createElement("input")
    questionText.value = q
    questionText.addEventListener("input", e => {
      customQuestions[i] = questionText.value
    })
    questionTextContainer.appendChild(questionText)
    questionRow.appendChild(questionTextContainer)

    const questionRemoverContainer = document.createElement("td")
    const questionRemover = document.createElement("button")
    questionRemover.textContent = "Remove"
    questionRemover.className = "btn danger"
    questionRemover.addEventListener("click", e => {
      customQuestions.splice(i, 1)
      updateCustomCardsEditor()
    })
    questionRemoverContainer.appendChild(questionRemover)
    questionRow.appendChild(questionRemoverContainer)

    $("#ayoc-questions").appendChild(questionRow)
  })

  customAnswers.forEach((q, i) => {
    const answerRow = document.createElement("tr")

    const answerTextContainer = document.createElement("td")
    const answerText = document.createElement("input")
    answerText.value = q
    answerText.addEventListener("input", e => {
      customAnswers[i] = answerText.value
    })
    answerTextContainer.appendChild(answerText)
    answerRow.appendChild(answerTextContainer)

    const answerRemoverContainer = document.createElement("td")



    const answerRemover = document.createElement("button")
    answerRemover.textContent = "Remove"
    answerRemover.className = "btn danger"
    answerRemover.addEventListener("click", e => {
      customAnswers.splice(i, 1)
      updateCustomCardsEditor()
    })
    answerRemoverContainer.appendChild(answerRemover)
    answerRow.appendChild(answerRemoverContainer)

    // $("#ayoc-answers").appendChild(answerRow)
  })
}

let addCustomCardsButton = document.createElement("button")
addCustomCardsButton.className = "btn"
addCustomCardsButton.addEventListener("click", e => {
  updateCustomCardsEditor()
  showScene("add-your-own-cards")
})
$("#mr-packs").appendChild(addCustomCardsButton)

let score = 0

$("#make-room").addEventListener("click", e => {
  customQuestions = []
  customAnswers = []
  addCustomCardsButton.textContent = "Add Your Own Scenarios..."
  showScene("make-room")
  document.getElementById("ad").style.visibility = "visible";
})

$("#ayoc-add-question").addEventListener("click", e => {
  customQuestions.push("")
  updateCustomCardsEditor()
})

// $("#ayoc-add-answer").addEventListener("click", e => {
//   customAnswers.push("")
//   updateCustomCardsEditor()
// })

$("#ayoc-back").addEventListener("click", e => {
  if (customAnswers.length > 0 || customQuestions.length > 0) {
    addCustomCardsButton.textContent = "Edit Your Cards..."
  } else {
    addCustomCardsButton.textContent = "Add Your Own Scenarios..."
  }
  showScene("make-room")
})

$("#singleplayer-room").addEventListener("click", e => {
  showScene("singleplayer-room")
  document.getElementById("ad").style.visibility = "visible";
})

$("#join-room").addEventListener("click", e => {
  showScene("join-room")
  document.getElementById("ad").style.visibility = "visible";
})

$("#sp-r1").addEventListener("click", e => {
  showScene("singleplayer-room1")
})

$("#sp-r2").addEventListener("click", e => {
  showScene("singleplayer-room2")
})

$("#sp-r3").addEventListener("click", e => {
  showScene("singleplayer-room3")
})

$("#mr-back").addEventListener("click", e => {
  showScene("start")
  document.getElementById("ad").style.visibility = "hidden";
})

$("#jr-back").addEventListener("click", e => {
  showScene("start")
  document.getElementById("ad").style.visibility = "hidden";
})

$("#hl-back").addEventListener("click", e => {
  showScene("start")
  document.getElementById("ad").style.visibility = "hidden";
})

$("#sp-back").addEventListener("click", e => {
  showScene("start")
  document.getElementById("ad").style.visibility = "hidden";
})

$("#sp-back1").addEventListener("click", e => {
  showScene("singleplayer-room")
})

$("#sp-back2").addEventListener("click", e => {
  showScene("singleplayer-room")
})

$("#sp-back3").addEventListener("click", e => {
  showScene("singleplayer-room")
})

$("#rcl-cancel").addEventListener("click", e => {
  window.location.reload()
})

$("#mr-submit").addEventListener("click", e => {
  const name = $("#mr-name").value
  const packsSelected = packs.map(({ name, checkbox }) => {
    if (checkbox.checked) {
      return name
    }
  }).filter(pack => !!pack)

  if (name.trim() !== "") {
    sendObj({
      action: "makeRoom",
      name,
      packs: packsSelected,
      questions: customQuestions.map(q => q.replace(/_+/, "[[BLANK]]")),
      answers: customAnswers
    })
  }
})

$("#jr-submit").addEventListener("click", e => {
  const name = $("#jr-name").value
  const joinCode = $("#jr-code").value

  if (name.trim() !== "") {
    if (joinCode.length === 6 && /[0-9]+/.test(joinCode)) {
      sendObj({
        action: "joinRoom",
        name,
        joinCode
      })
    }
  }



})

$("#rcl-start-game").addEventListener("click", e => {
  sendObj({ action: "startGame" })
})

$("#open-chat").addEventListener("click", e => {
  $(".bottom-bar").classList.add("hidden")
  $(".content").classList.remove("sidebar-hidden")
})

$("#close-chat").addEventListener("click", e => {
  $(".bottom-bar").classList.remove("hidden")
  $(".content").classList.add("sidebar-hidden")
})

$("#msg-form").addEventListener("submit", e => {
  e.preventDefault()
  const content = $("#msg-content").value

  if (content.trim() !== "") {
    sendObj({ action: "sendChat", content })
    addChatMessage("You", content, "#0000ff")
    $("#msg-content").value = ""
  }
})

ws.addEventListener("open", () => {
  if (/#j\-([0-9]{6})/.test(location.hash)) {
    $("#jr-code").value = location.hash.match(/#j\-([0-9]{6})/)[1]
    location.hash = ""
    showScene("join-room")
  } else {
    showScene("start")
  }
})

ws.addEventListener("close", () => {
  showScene("closed")
})

ws.addEventListener("message", e => {
  const msgObj = JSON.parse(e.data)
  console.log(msgObj)
  if (msgObj.action === "roomMade") {
    score = 0
    setNavbar(msgObj.setName, "Room #" + msgObj.joinCode)

    $("#rcl-code").textContent = msgObj.joinCode
    $("#rcl-members").textContent = ""

    $("#rcl-copy-invite").addEventListener("click", () => {
      copyText(location.origin + location.pathname + "#j-" + msgObj.joinCode)
    })

    showScene("room-creator-lobby")
  } else if (msgObj.action === "roomJoined") {
    score = 0
    setNavbar(msgObj.setName, "Room #" + msgObj.joinCode)

    $("#rjl-members").textContent = ""
    msgObj.members.forEach(m => {
      const memberItem = document.createElement("li")
      memberItem.textContent = m
      $("#rjl-members").appendChild(memberItem)
    })
    showScene("room-joiner-lobby")
  } else if (msgObj.action === "memberJoined") {
    const rjlMemberItem = document.createElement("li")
    rjlMemberItem.textContent = msgObj.name
    $("#rjl-members").appendChild(rjlMemberItem)

    const rclMemberItem = document.createElement("li")
    rclMemberItem.textContent = msgObj.name
    $("#rcl-members").appendChild(rclMemberItem)
  } else if (msgObj.action === "memberLeft") {
    ["#rcl-members", "#rjl-members"].forEach(q => {
      $(q).childNodes[msgObj.id].remove()
    })
  } else if (msgObj.action === "gameStart") {
    $(".bottom-bar").classList.remove("hidden")
    $(".bottom-bar2").classList.remove("hidden")
  } else if (msgObj.action === "newQuestion") {
    setNavbar(null, score + " Point" + (score == 1 ? "" : "s"))
    $("#q-question").textContent = msgObj.question

    if (msgObj.question === "1") {
      document.getElementById("booknumber").style.visibility = "visible";
      document.getElementById("q-question").style.visibility = "hidden";
      document.getElementById("q-question").style.height = "0pt";
      document.getElementById("q-question").style.width = "0pt";
      document.getElementById("booknumber").href = "book1.html";
    }
    else if (msgObj.question === "2") {
      document.getElementById("booknumber").style.visibility = "visible";
      document.getElementById("q-question").style.visibility = "hidden";
      document.getElementById("q-question").style.height = "0pt";
      document.getElementById("q-question").style.width = "0pt";
      document.getElementById("booknumber").href = "book2.html";
    }
    else if (msgObj.question === "3") {
      document.getElementById("booknumber").style.visibility = "visible";
      document.getElementById("q-question").style.visibility = "hidden";
      document.getElementById("q-question").style.height = "0pt";
      document.getElementById("q-question").style.width = "0pt";
      document.getElementById("booknumber").href = "book3.html";
    }
    else {
      document.getElementById("booknumber").style.visibility = "hidden";
      document.getElementById("q-question").style.visibility = "visible";
      document.getElementById("q-question").style.height = "320pt";
      document.getElementById("q-question").style.width = "200pt";
    }

    $("#q-judge").textContent = msgObj.judge

    document.getElementById("submission").style.visibility = "visible";

    $("#submit-button").addEventListener("click", e => {
      const r1a = document.getElementById("r1").value;
      $("#wfo-question").textContent = msgObj.question
      $("#wfo-answer").textContent = r1a
      sendObj({ action: "selectedAnswer", answer: r1a })

      document.getElementById("submission").style.visibility = "hidden";
    
      showScene("waiting-for-others")
    })

    document.getElementById("r1").value = '';

    showScene("question")
  } else if (msgObj.action === "showAnswers") {
    $("#wfj-answers").textContent = ""
    $("#wfj-judge").textContent = msgObj.judge
    msgObj.answers.forEach(a => {
      const answerItem = document.createElement("div")

      const answerCard = document.createElement("div")
      answerCard.classList.add("card")
      answerCard.classList.add("red")
      answerCard.textContent = a

      answerItem.appendChild(answerCard)

      $("#wfj-answers").appendChild(answerItem)
    })

    showScene("waiting-for-judge")
  } else if (msgObj.action === "selectAnswer") {
    $("#j-question").textContent = msgObj.question
    $("#j-answers").textContent = ""
    msgObj.answers.forEach(a => {
      const answerContent = document.createElement("div")
      answerContent.textContent = a

      const answerButton = document.createElement("button")
      answerButton.appendChild(answerContent)
      answerButton.addEventListener("click", () => {
        sendObj({ action: "selectedAnswer", answer: a })
      })

      $("#j-answers").appendChild(answerButton)
    })

    if (msgObj.question === "1") {
      document.getElementById("booknumber3").style.visibility = "visible";
      document.getElementById("j-question").style.visibility = "hidden";
      document.getElementById("j-question").style.height = "0pt";
      document.getElementById("j-question").style.width = "0pt";
      document.getElementById("booknumber3").href = "book1.html";
    }
    else if (msgObj.question === "2") {
      document.getElementById("booknumber3").style.visibility = "visible";
      document.getElementById("j-question").style.visibility = "hidden";
      document.getElementById("j-question").style.height = "0pt";
      document.getElementById("j-question").style.width = "0pt";
      document.getElementById("booknumber3").href = "book2.html";
    }
    else if (msgObj.question === "3") {
      document.getElementById("booknumber3").style.visibility = "visible";
      document.getElementById("j-question").style.visibility = "hidden";
      document.getElementById("j-question").style.height = "0pt";
      document.getElementById("j-question").style.width = "0pt";
      document.getElementById("booknumber3").href = "book3.html";
    }
    else {
      document.getElementById("booknumber3").style.visibility = "hidden";
      document.getElementById("j-question").style.visibility = "visible";
      document.getElementById("j-question").style.height = "320pt";
      document.getElementById("j-question").style.width = "200pt";
    }

    showScene("judging")
  } else if (msgObj.action === "chatMessage") {
    addChatMessage(msgObj.from, msgObj.content, "#000000")
  } else if (msgObj.action === "updateScore") {
    score = msgObj.score
    setNavbar(null, score + " Point" + (score == 1 ? "" : "s"))
  } else if (msgObj.action === "judgeSelected") {
    $("#js-question").textContent = msgObj.question
    $("#js-answer").textContent = msgObj.answer
    $("#js-submitted-by").textContent = msgObj.submittedBy
    showScene("judge-selected")
  } else if (msgObj.action === "youAreTheJudge") {
    $("#yatj-question1").textContent = msgObj.question
    $("#yatj-question2").textContent = msgObj.question
    document.getElementById("submission").style.visibility = "hidden";

    if (msgObj.question === "1") {
      document.getElementById("booknumber2").style.visibility = "visible";
      document.getElementById("yatj-question1").style.visibility = "hidden";
      document.getElementById("yatj-question1").style.height = "0pt";
      document.getElementById("yatj-question1").style.width = "0pt";
      document.getElementById("booknumber2").href = "book1.html";
    }
    else if (msgObj.question === "2") {
      document.getElementById("booknumber2").style.visibility = "visible";
      document.getElementById("yatj-question1").style.visibility = "hidden";
      document.getElementById("yatj-question1").style.height = "0pt";
      document.getElementById("yatj-question1").style.width = "0pt";
      document.getElementById("booknumber2").href = "book2.html";
    }
    else if (msgObj.question === "3") {
      document.getElementById("booknumber2").style.visibility = "visible";
      document.getElementById("yatj-question1").style.visibility = "hidden";
      document.getElementById("yatj-question1").style.height = "0pt";
      document.getElementById("yatj-question1").style.width = "0pt";
      document.getElementById("booknumber2").href = "book3.html";
    }
    else {
      document.getElementById("booknumber2").style.visibility = "hidden";
      document.getElementById("yatj-question1").style.visibility = "visible";
      document.getElementById("yatj-question1").style.height = "320pt";
      document.getElementById("yatj-question1").style.width = "200pt";
    }

    showScene("you-are-the-judge")
  } else if (msgObj.action === "hostLeft") {
    setNavbar(null, "")
    document.getElementById("chatbox").style.visibility = "hidden";
    document.getElementById("submission").style.visibility = "hidden";
    showScene("host-left")
  } else if (msgObj.action === "preparingGame") {
    showScene("preparing-game")
  } else if (msgObj.action === "error") {
    alert(msgObj.content)
  }
})

var slidePosition = 1;
SlideShow(slidePosition);

// forward/Back controls
function plusSlides(n) {
  SlideShow(slidePosition += n);

  style = "height: auto; margin: 0 auto; padding: 35pt; position: relative;"

  if (slidePosition === 1) {
    document.getElementById("animalcharacter").src = "animals/bunny1gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 2) {
    document.getElementById("animalcharacter").src = "animals/bunny2gif2.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 3) {
    document.getElementById("animalcharacter").src = "animals/cat1gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 4) {
    document.getElementById("animalcharacter").src = "animals/cat2gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 5) {
    document.getElementById("animalcharacter").src = "animals/goat1gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 6) {
    document.getElementById("animalcharacter").src = "animals/goat2gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 7) {
    document.getElementById("animalcharacter").src = "animals/koala1gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 8) {
    document.getElementById("animalcharacter").src = "animals/koala2gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 9) {
    document.getElementById("animalcharacter").src = "animals/pig1gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }
  else if (slidePosition === 10) {
    document.getElementById("animalcharacter").src = "animals/pig2gif.gif";
    document.getElementById("animalcharacter").style.width = "auto";
    document.getElementById("animalcharacter").style.margin = "0 auto";
    document.getElementById("animalcharacter").padding = "35pt";
    document.getElementById("animalcharacter").position = "relative";
  }

}

function SlideShow(n) {
  var i;
  var slides = document.getElementsByClassName("Containers");
  var circles = document.getElementsByClassName("dots");
  if (n > slides.length) { slidePosition = 1 }
  if (n < 1) { slidePosition = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < circles.length; i++) {
    circles[i].className = circles[i].className.replace(" enable", "");
  }
  slides[slidePosition - 1].style.display = "block";
  circles[slidePosition - 1].className += " enable";
}

var showHide1 = document.getElementById("sp-submit1");
var demo1 = document.getElementById("suggested1");
showHide1.onclick = function () {
  if (demo1.style.display == "block") {
    demo1.style.display = "none";
  } else {
    demo1.style.display = "block";
    showHide1.style.display = "none";
  }
}

var showHide2 = document.getElementById("sp-submit2");
var demo2 = document.getElementById("suggested2");
showHide2.onclick = function () {
  if (demo2.style.display == "block") {
    demo2.style.display = "none";
  } else {
    demo2.style.display = "block";
    showHide2.style.display = "none";
  }
}

var showHide3 = document.getElementById("sp-submit3");
var demo3 = document.getElementById("suggested3");
showHide3.onclick = function () {
  if (demo3.style.display == "block") {
    demo3.style.display = "none";
  } else {
    demo3.style.display = "block";
    showHide3.style.display = "none";
  }
}