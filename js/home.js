////////////////////////////// Home //////////////////////////////
var containerCard = document.querySelector(".containerCard");
var containerCards = document.querySelector(".containerCards");
var toRemoveAfterClone = document.querySelector(".toRemoveAfterClone");
var imgMeme = document.querySelector(".imgMeme");
var titleMeme = document.querySelector(".titleMeme");
var buttonAddCaption = document.querySelector(".addCaption");
////////////////////////////// Editor //////////////////////////////
var toRemoveAfterCloneTool = document.querySelector(".toRemoveAfterCloneTool");
var mainContainerTools = document.querySelector(".mainContainerTools");
var containerTool = document.querySelector(".containerTool");
var containerEditor = document.querySelector(".mainContainerEditor");
var containerBlackboard = document.querySelector(".containerBlackboard");
var imgToEdit = document.querySelector(".imgToEdit");
var inputText = document.querySelectorAll(".inputText");
var btnIncreaseFontSize = document.querySelector(".increaseFontSize");
var btnDecreaseFontSize = document.querySelector(".decreaseFontSize");


///////////////////////////// Others ///////////////////////////////
var currentMeme = [];
var url;
var req;
var json;
////////////////////////////////////////////////////////////////////

async function getMemes() {
  url = `https://api.imgflip.com/get_memes`;
  req = await fetch(url);
  json = await req.json();

  //Monta a pagina home com a requisição
  for (var i = 0; i < json.data.memes.length; i++) {
    //origem da clonagem
    var newCard = containerCard.cloneNode(true);

    // destino da clonagem
    var add = containerCards.append(newCard);

    containerCard.style.display = "flex";

    toRemoveAfterClone.style.display = "none";

    //aqui começamos a preencher os cards com os memes
    imgMeme.setAttribute("src", json.data.memes[i].url);
    titleMeme.innerHTML = json.data.memes[i].name;
    buttonAddCaption.setAttribute("name", json.data.memes[i].name);
    buttonAddCaption.setAttribute("key", json.data.memes[i].url);
    buttonAddCaption.setAttribute("boxCount", json.data.memes[i].box_count);
  }
}

function mountEditor() {
  containerEditor.style.display = "flex";
  imgToEdit.setAttribute("src", currentMeme[0].src);

  //Monta a quantidade de containerTool equivalente a quantidade requerida pelo meme
  for (let i = 0; i < currentMeme[0].boxCount; i++) {
    //origem da clonagem
    var newBox = containerTool.cloneNode(true);

    // destino da clonagem
    var add = mainContainerTools.append(newBox);

    mainContainerTools.children[0].style.display = "flex";
    containerTool.style.display = "flex";
    toRemoveAfterCloneTool.style.display = "none";
  }

  

  konva();
}

function teste() {
  var containerAddText = document.querySelectorAll(".containerAddText");
  for (let i = 0; i < currentMeme[0].boxCount; i++) {
    containerAddText.forEach((e) => {
      var a = 0
      e.children[0].setAttribute("key", `simple-label${[a]}`)
      a++
    })
  //   containerAddText.setAttribute("key", `simple-label${[i]}`);
  }



  
}

window.addEventListener("click", (e) => {
  if (e.target.innerHTML == "Add a caption") {
    currentMeme.push({
      src: e.target.getAttribute("key"),
      name: e.target.getAttribute("name"),
      boxCount: e.target.getAttribute("boxCount"),
    });

    containerCards.style.display = "none";

    mountEditor();
  }
});

function konva() {
  ////////////////// Camada e estágio //////////////////
  var width = containerBlackboard.offsetWidth;
  var height = containerBlackboard.offsetHeight;

  var stage = new Konva.Stage({
    container: "containerBlackboard",
    width: width,
    height: height,
  });

  var layer = new Konva.Layer();

  //////////////////// Imagem //////////////////

  var img = currentMeme[0].src;
  var imageObj = new Image();
  imageObj.onload = function () {
    var imgMeme = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: width,
      height: height,
    });
    layer.add(imgMeme);
    imgMeme.moveToBottom();
  };
  imageObj.src = img;

  //////////////////// Label //////////////////

  var labelText = "";
  var fontSizeTxt = 30;

  for (let i = 0; i < currentMeme[0].boxCount; i++) {
    // cria o label
    var simpleLabel = new Konva.Label({
      x: Math.floor(Math.random() * 200),
      y: 0,
      opacity: 1,
      draggable: true,
    });

    // adiciona a tag do label
    simpleLabel.add(
      new Konva.Tag({
        fill: "transparent",
        stroke: "black",
        strokeWidth: 1,
        cornerRadius: 5,
      })
    );

    // adiciona o texto no label
    simpleLabel.add(
      new Konva.Text({
        text: `Text${[i + 1]}`,
        fontFamily: "Calibri",
        fontSize: fontSizeTxt,
        padding: 5,
        fill: "black",
        name: `simple-label${[i]}`,
      })
    );

    layer.add(simpleLabel);
  }

  //atualiza o label, toda vez que for digitado algo no input
  window.addEventListener("keyup", (e) => {
    if (e.target.className == "inputText") {
      let array = [];
      for (let i = 0; i < 3; i++) {
        array.push(layer.find(`.simple-label${[i]}`)[0]);
      }

      // for (let i = 0; i < array.length; i++) {
      //   if (e.target.classList.contains(array[i].attrs.name)) {
      //     console.log('deu certoooo!')
      //   }
      // }

      console.log(array);
    }
  });

  //aumenta e diminui o fontSize clicando nas opções
  btnIncreaseFontSize.addEventListener("click", () => {
    if (fontSizeTxt <= 158) {
      var textSize = layer.find(".simple-label")[0];
      fontSizeTxt = fontSizeTxt + 2;
      textSize.setAttr("fontSize", fontSizeTxt);
      console.log(textSize.attrs.fontSize);
      layer.draw();
    }
  });

  btnDecreaseFontSize.addEventListener("click", () => {
    if (fontSizeTxt >= 12) {
      var textSize = layer.find(".simple-label")[0];
      fontSizeTxt = fontSizeTxt - 2;
      textSize.setAttr("fontSize", fontSizeTxt);
      console.log(textSize.attrs.fontSize);
      layer.draw();
    }
  });

  //muda o cursor
  simpleLabel.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  simpleLabel.on("mouseout", function () {
    document.body.style.cursor = "default";
  });

  ////////////////// Adiciona as coisas no layer, e depois no stage //////////////////

  stage.add(layer);
  layer.draw();
}
