    var LIFE_NUMBER = 3 
    var userChoose = '';
    var SCORE = 98 ;
    var LIFE = LIFE_NUMBER ;
    var SOUND = true;
    var HIGHSCORE = 0;

    var Troll = {
        Question  : [],
        getQuestion :  function(url,callback){
            self = this;
          var tmp = document.createElement("div");
          $(tmp).load(url,function(){
            self.Question = $(tmp).text().split("\n");
            console.log("ok! loaded question ! " ) ;
            Game.nextQuestion++;
            callback();
          });
        },
        getQuestionNum : function(){
            return this.Question[0];
        },
        getQuestionName : function(){
            return this.Question[2];
        },
        getAnswer: function(ans){
            var arrAns = [];
            for(var i = 3 ; i < 7 ; i++){
                arrAns.push(this.Question[i]);
            }
            switch(ans){
                case "a":
                    return arrAns[0];
                    
                case "b":
                    return arrAns[1];
                    
                case "c":
                    return arrAns[2];
                    
                case "d":
                    return arrAns[3];
                    
                default : 
                    console.log("getAnswers _ nhap ten dap an ! " );
            }
        },
        getCorrectAnswer : function(){
            switch(Troll.Question[1]){
                case "A":
                    return Troll.getAnswer("a");
                case "B":
                    return Troll.getAnswer("b");
                case "C":
                    return Troll.getAnswer("c");
                case "D":
                    return Troll.getAnswer("d");
            }
        },
        getExplain : function(){
            return this.Question[7];
        }
    }; //end Troll
      
    var Game = {
        //vars :
        nextQuestion : 0,
        currentQuestion : 1 ,
            //UI : 
        $wrapper : $("#wrapper"),
        $infoWrapper : $("#infoWrapper"),
        $infoDialogContent : $("#infoDialogContent"),
        
        $confirmWrapper : $("#confirmWrapper"),
        $confirmContent : $("#confirmContent"),
            //question 
        $questionName : $("#question"),
        $questionPic : $("#questionPic"),
        
        //BUTTONS  :
        $gameStartBtn : $("#gameStartBtn"),
        $highScoreBtn : $("#highScoreBtn"),
        $menuBtn : $("#menuBtn,#aboutMenu"),
        $aboutBtn : $("#aboutBtn"),
        $playAgainBtn : $("#playAgainBtn"),
        $ansA : $(".answer:eq(0)"),
        $ansB : $(".answer:eq(1)"),
        $ansC : $(".answer:eq(2)"),
        $ansD : $(".answer:eq(3)"),
        $ans : $(".answer"),
        $questionNum  : $("#questionNum"),
        $effect : $(".onTouchStart"),

        $menuAvatarWrapper : $("#menuAvatarWrapper"),
        $avatar : $("#avatar"),
        $life : $("#life"),
        $score : $(".score,#gameOverScore"),
        $sound : $("#sound"),
        $soundOff : $("#soundOff"),
        $soundOn : $("#soundOn"),

        $gameOverImgWrapper : $("#gameOverImgWrapper"),
         $gameOverTrollContent : $("#gameOverTrollContent"),
        //STATES : 
        $gameLoading : $("#gameLoading"),
        $gameMenu : $("#gameMenu"),
        $gameStart : $("#gameStart"),
        $gameOver : $("#gameOverWrapper"),
        $highScoreWrapper : $("#highScoreWrapper"),
            $highScore : $("#highScore"),
            $highScoreCloseBtn : $("#highScoreCloseBtn"),
        $aboutWrapper : $("#aboutWrapper"),
            $aboutRate : $("#aboutRate"),
            $aboutMoreApp : $("#aboutMoreApp"),
        arrQuestions : [],

        //FUNCTIONS : 
        genQuestions : function(){
            //random quesion moi lan choi 
          var n = this.arrQuestions.length , i , tmp ;
            while(n){
                    i = Math.floor(Math.random() * n--);
                    tmp = this.arrQuestions[n];
                    this.arrQuestions[n] = this.arrQuestions[i];
                    this.arrQuestions[i] = tmp;
                }
            console.log(this.arrQuestions);
        },
        showQuesion : function(){
            var self = Game;
          //hien thi question : 
            console.log("show question " );
            self.appendRandImage(self.$questionPic);
            $(self.$questionName).text(Troll.getQuestionName());
            $(self.$ansA).text(Troll.getAnswer("a"));
            $(self.$ansB).text(Troll.getAnswer("b"));
            $(self.$ansC).text(Troll.getAnswer("c"));
            $(self.$ansD).text(Troll.getAnswer("d"));
        },
        makeQuestion : function(){
          var url = String("assets/ques/question" + this.arrQuestions[this.nextQuestion] + ".html");
          Troll.getQuestion(url,Game.showQuesion);
          console.log(url);  
        },
        processAnswer : function(){
            if(userChoose === Troll.getCorrectAnswer()) this.chooseTrue();
            else this.chooseFalse();

        },
        chooseTrue : function(){
            SCORE++;
            SCORE > parseInt(Storage.get("h")) ? Storage.set() : "";

            if(SCORE >= 100){
                this.$gameOverTrollContent.text("Chúc mừng bạn đã phá đảo ! Bạn đã sẵn sàng làm thợ sửa ống nước trọn đời bên nàng công chúa rồi chứ ! :3 ");
                $("#gameOverImgWrapper img").attr("src","face/sexyTroll.gif");
                this.gameOver();
            }else{
                this.makeQuestion();
                if(String(Troll.getExplain()) == "0") this.showInfoDialog(this.trollContent("t"),2);
                else this.showInfoDialog(Troll.getExplain(),4);
                console.log("Game.chooseTrue _ choose true !,SCORE ++ "); 
            }
             this.updateGameStat("t");
        },
        chooseFalse : function(){
            LIFE--;
            this.updateGameStat("f");
            this.showInfoDialog(this.trollContent("f"),2);
            console.log("Game.chooseFalse _ choose false ! , LIFE--");
            if(LIFE <= 0 ){
                this.gameOver();
                this.showInfoDialog(this.trollContent("o"),3);
            }
        },
        updateGameStat : function(type){
          type === "t" ?  this.currentQuestion++ : this.currentQuestion;
          this.$questionNum.text("C:"+ (this.currentQuestion));
          this.$life.text(LIFE);
          this.$score.text("score : " + SCORE);

        },
        trollContent :function(type){
            var arr = [] ;
            if(type === "f"){
                //khi chọn sai ,vẫn còn mạng,hiện ở phần dialog info
                 arr = [
                    "Sai rồi,chọn cẩn thận vào :))",
                    "Chọn lại đuê,nghĩ kỹ vào :v ",
                    "Sai rồi,cho chọn phát nữa :))"
                ];
            }
            if(type === "t"){
                //khi trả lời đúng và câu explain ko có giá trị gì (trả về 0), hiện ở phần info Dialog
                 arr = [
                    "đúng rồi,có cố gắng :))",
                    "được !Thông minh lắm !",
                    "Tốt! khôn hơn rồi đấy :3 ",
                    "câu đấy dễ,câu này mới khó này",
                    "thông minh dữ o_O ? ",
                    "khá lắm ! Tiếp tục phát huy :))",
                    "Tuyệt vời ông mặt trời."
                ];
            }
            if(type === "o"){
                //lúc chọn sai + game over -> hiện ở phần info dialog
                arr = [
                    "còn phải học hỏi nhiều :))",
                    "trình độ chưa tới đã đòi trả lời nhanh :))",
                    "chúc bạn may mắn lần sau :3 ",
                    "tớ thích cách trả lời của bạn :))"
                ]
            }
            if(type === "l"){
                //lời troll khi ở game state GameOVer 
                arr = [
                    "xấu nhưng biết phấn đấu",
                    "đau thế nhỉ :v , muốn chơi lại không ?",
                    "why why why :)) ",
                    "blah blah blah"
                    ]
            }
            return arr[Math.floor(Math.random()*(arr.length - 1))];
        },
        gameComplete : function(){
            //chuc mung nguoi choi 
        },
        confirmAnswer : function(timesConfirm){
            //hoi ban co muon chon dap an nay ko ?
            if(timeConfirm){
                var  arr = [
                    "Bạn thực sự muốn chọn đáp án này hả ? Cẩn thận đấy ! ",
                    "Xem kĩ lại đáp án đi! sai đấy ! " ,
                    "Chọn đáp án khác đi,đáp án này khả năng cao là sai đấy ",
                    "Vẫn muốn chọn hả ? Bảo không nghe sai cố mà chịu nhá " 
                      ];
                var length = timesConfirm;
                if(timesConfirm > arr.length){
                    length =arr.length-1;  
                    for(var i = 0 ; i < length;){
                        this.showPrompt(arr[i]);
                        i++;
                        if(this.clickNotify() === false){
                            console.log("confirmAnser,user bam cancel,tat notify ! " );   
                            break;
                        }
                        console.log("confirm Answer , notify lan thu " + (i + 1) + " trong tong so " + length + " lan ");
                    }   
                }
            }//end check so lan confirm 
        },//end confirm AnswerN
        appendImage : function(element,imgOB){
            // element./()
            element.append(imgOB);
            console.log("append Img,da gan the anh ");
        },
        appendRandImage : function(element){
            var rand = AssetManager.imgLoadedArr[Math.floor(Math.random() * AssetManager.listImg.length)];
            element.children().remove();
            element.append(rand);
            console.log("random background Image");
        },
        showAbout : function(){
            this.$aboutWrapper.css("display","block");
            this.$gameOver.css("display","none");
            this.$highScoreWrapper.css("display","none");
            this.$gameMenu.css("display","none");
            this.$sound.css("display","none");
            this.$gameStart.css("display","none");
        },

//UI : 
        fitText : function(ob){
            var x = Math.min(ob.width()/2,ob.height()/2);
            ob.css("font-size",x+"px").css("lineHeight","2");
            console.log("fit text");

        },
        showClickEffect : function(){
            this.$effect.on("touchstart",function(){
                $(this).addClass("touchStart");
            }).on("touchend",function(){
                $(this).removeClass("touchStart");
            })
        },
        showInfoDialog : function(content,time){
            window.clearTimeout(window.DIALOG);
            console.log("show info dialog ! " );
            var self = this;
            this.$infoDialogContent.text(content);
            this.$infoWrapper.fadeIn(400,function(){
                window.DIALOG = window.setTimeout(function(){
                    self.$infoWrapper.fadeOut(400);
                },time*1000);
            });            
        },
        showPrompt : function(content){
            this.$confirmContent.text(content);
            this.$confirmContent.fadeToggle(400);
        },
        showHighScore : function(){
            this.$highScoreWrapper.css("display","block");

        },
        //ACTIVITY 
        clickGameStart : function(){
            this.gameStart();
        },
        clickPrompt : function(bool){
            if(bool === true) return true;
            else return false;
        },
        clickSound : function(){
            if(SOUND){
                this.$soundOff.css("display","block");
                this.$soundOn.css("display","none");
            }else{
                this.$soundOff.css("display","none");
                this.$soundOn.css("display","block");
            }
            AssetManager.toggleSound();
        },
        clickHighScore : function(){
            this.highScore();
        },
        clickAbout : function(){
            this.showAbout();
        },
        //GAME STATE : 
        loading : function(){
            console.log("%cLOADING","background-color:black;color:white");
            AssetManager.loadImg(function(){
                Game.init(function(){
                    Game.$gameLoading.css("display","none");
                });
            });
        },
        init : function(callback){
            var self = this;
        //fit text phần menu chính :
        window.setTimeout(function(){
            self.$wrapper.flowtype();
            callback();
        },2000)
        //khoi tao khi game bat dau , tao 1 mang gom 100 phan tu = 100 cau hoi trong db 
            for(var i = 1 ; i < 101 ; i++)
                this.arrQuestions.push(i);
            Storage.init();
            Storage.set();
            SOUND = Storage.get("s");
            HIGHSCORE = Storage.get("h");

          this.$ans.on("click",function(){
           userChoose = $(this).text();
           self.processAnswer();
              console.log("user choose : " + userChoose);
          });

          this.$gameStartBtn.on("click",function(){
            self.clickGameStart();
          });

          this.$highScoreBtn.on("click",function(){
            self.clickHighScore();
          });

          this.$aboutBtn.on("click",function(){
            self.clickAbout();
          });

          this.$playAgainBtn.on("click",function(){
            self.gameStart();
          });

          this.$menuBtn.on("click",function(){
            self.gameMenu();
          });

          this.$sound.on("click",function(){
            self.clickSound();
          });
          this.$highScoreBtn.on("click",function(){
            self.highScore();
          })
          this.$highScoreCloseBtn.on("click",function(){
            self.gameMenu();
          })
          this.showClickEffect();
        //trao questions
            this.genQuestions();
        //thay đổi game state img lúc đầu game và cuối lúc end game 
            this.makeQuestion();
        //tien hanh goi callback
        // callback();
        },
        gameMenu : function(){
            this.$gameMenu.css("display","block");
            this.$sound.css("display","block");
            this.$aboutWrapper.css("display","none");
            this.$highScoreWrapper.css("display","none");
            this.$gameStart.css("display","none");
            this.$gameOver.css("display","none");
            
        },
        gameStart : function(){
            var self = this;
            this.resetGame();
            this.$gameOver.css("display","none");
            this.$highScoreWrapper.css("display","none");
            this.$gameMenu.css("display","none");
            this.$sound.css("display","none");
            this.$aboutWrapper.css("display","none");
            this.$gameStart.css("display","block");
            this.updateGameStat("f");

            console.log("game Start ! " );

            //delay chờ cho css được tải về ,sau đó fit font size : 
                self.$infoWrapper.fitText();    
                self.$wrapper.flowtype();
            //tráo câu hỏi 
            this.genQuestions();
            //fetch question
            this.makeQuestion();
        },
        gameOver : function(){
            this.$gameStart.css("display","none");
            this.$gameMenu.css("display","none");
            this.$highScoreWrapper.css("display","none");
            this.$aboutWrapper.css("display","none");
            this.$gameOver.css("display","block");
            this.$sound.css("display","block");
            console.log("game over state");
            Storage.set();
            this.updateGameStat("f");
            if(SCORE < 100) this.$gameOverTrollContent.text(this.trollContent("l"));
        },//game OVER SCreen
        highScore : function(){
            this.$sound.css("display","block");
            this.$highScoreWrapper.css("display","block");
            this.$aboutWrapper.css("display","none");
            this.$gameStart.css("display","none");
            this.$gameMenu.css("display","none");
            this.$gameOver.css("display","none");
            this.$highScore.text(HIGHSCORE);
        },
        resetGame: function(){
            //tiến hành splice arQuestions,loại bỏ những câu hỏi đã trả lời trong phiên chơi hiện tại , nếu gần hết câu hỏi thì bắt đầu nạp lại câu hỏi !
            if(this.arrQuestions.length >= 20){
                this.arrQuestions.splice(0,this.currentQuestion);
            }
            else this.genQuestions();
            LIFE = LIFE_NUMBER;
            SCORE = 0;
            Game.nextQuestion = 0 ;
            Game.currentQuestion = 1 ;
            console.log("reset GAME state ! ");
        }
    }; // end Game OB 

    var AssetManager = {
    //IMAGE MANAGER  : 
        listImg : [
            "forever_alone_happy", 
            "fuck",
            "fuck_yeah_clean",
            "jesus",
            "me_gusta_creepy",
            "no",
            "oh_you_so_cute",
            "pokerface_2_clean",
            "serious_not_okay",
            "spiderpman",
            "troll_face",
            "whyyy",
            "wow",
            "dancing",
        ],
        loadedImg : 0,
        imgLoadedArr : [],
        loadImg : function(callback){
            var self = AssetManager;
            for(var i = 0 ; i < self.listImg.length ;i++){
                var path = "face/" + self.listImg[i] + ".gif";
                var img = new Image();
                 img.src = path;  
                self.imgLoadedArr.push(img);

                img.addEventListener("load",function(){
                    self.loadedImg+=1;
                    console.log(this.src + " loaded ");
                    if(self.isImgLoadDone() === true) callback();
                },false);

                img.addEventListener("error",function(){
                    console.log("err");
                },false);
            }

            console.log("loaded : " + AssetManager.loadedImg + " total img in arrIMG : " + AssetManager.listImg.length);
        },
        isImgLoadDone : function(){
            if(this.loadedImg === this.listImg.length ) return true;
            else return false;
        },
        getImg : function(name){
            self = AssetManager;
            return self.imgLoadedArr[self.listImg.indexOf(name)];
        },

    //SOUND MANAGER :
        listSound : [
                ""
        ],
        loadedSound : 0,
        soundLoadedArr : [],
        isSoundLoaded : function(){
            var s = AssetManager;
            if(s.loadedSound === s.listSound.length) return true;
            else return false;
        },
        loadSound : function(callback){

        },
        getSound : function(name){

        }, 
        toggleSound : function(){
           if(SOUND){
                SOUND = false;
                this.turnSoundOff();
            }else{
                SOUND = true;
                this.turnSoundOn();
            }
            console.log("sound : " +SOUND);
        },
        turnSoundOn : function(){

        },
        turnSoundOff : function(){

        }
}//Game 

var Storage = {
    init : function(){
        console.log("khoi tao localStorage");
        if(!localStorage.Troll){
            localStorage.Troll = JSON.stringify({
                "sound" : true,
                "highScore" : 0
            })
        }
    },
    set : function(){
            var h = parseInt(Storage.get("h"));
            var high = SCORE <  h ?  high = h : high = SCORE;
            localStorage.Troll = JSON.stringify({
                "sound" : SOUND,
                "highScore" : high
            });
            console.log("da luu gia tri ! ");
    },
    get : function(type){
        var ob = JSON.parse(localStorage.Troll);
        console.log("get item " +  type);
        if(type === "s") return ob.sound;
        else return ob.highScore; 
    }
}
Game.loading();