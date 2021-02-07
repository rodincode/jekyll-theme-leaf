---
layout: post
author: Bhavik Jain
title: Student - Bhavik Jain
---

### `My Projects`

> * Pong Game <br>
> <img src="{{ site.baseurl }}/assets/pong.gif" width="300" height="200" />

``` python

import turtle 
import playsound
canvas=turtle.Screen()
canvas.title('Ping Pong Game')
canvas.bgcolor('#4AFC02')
canvas.setup(width=800,height=600)


# rect=turtle.Turtle()
# rect.penup()
# rect.goto(-400,-300)
# rect.pendown()
# for i in range(2):
#     rect.forward(800)
#     rect.left(90)
#     rect.forward(590)
#     rect.left(90)
# rect.hideturtle()
 

ball=turtle.Turtle()
ball.color('orange')
ball.shape('circle')
ball.shapesize(stretch_wid=1,stretch_len=1)
ball.penup()

pedal=turtle.Turtle()
pedal.color('orange')
pedal.penup()
pedal.goto(380,0)
pedal.pendown()
pedal.shape('square')
pedal.shapesize(stretch_wid=5,stretch_len=1)
pedal.penup()

pedal2=turtle.Turtle()
pedal2.color('orange')
pedal2.penup()
pedal2.goto(-380,0)
pedal2.pendown()
pedal2.shape('square')
pedal2.shapesize(stretch_wid=5,stretch_len=1)
pedal2.penup()

#ball.xcor()--> gives you current x cord., ball.ycor()--> current y coord
# ball.setx() ball.sety() --> set x and y separately
pointa=0 
pointb=0
score=turtle.Turtle()
score.penup()
score.goto(-250,300)
score.pendown()
score.write("Player A: {}   Player B: {}".format(pointa,pointb),font=('arial',24,'bold'))



score.hideturtle()

def pedal_go_up():
    pedal.sety(pedal.ycor()+20)

def pedal_go_down():
    pedal.sety(pedal.ycor()-20)

def pedal2_go_up():
    pedal2.sety(pedal2.ycor()+20)

def pedal2_go_down():
    pedal2.sety(pedal2.ycor()-20)



canvas.listen()
canvas.onkeypress(pedal_go_up,"Up")
canvas.onkeypress(pedal_go_down,"Down")
canvas.onkeypress(pedal2_go_up,"w")
canvas.onkeypress(pedal2_go_down,"s")

speedx = 2
speedy = 2
while True:
    ball.setx(ball.xcor()+speedx)
    ball.sety(ball.ycor()+speedy)

    if ball.ycor()>300:
        speedy = speedy*-1
        
    elif ball.ycor()<-300:
        speedy = speedy*-1

        ''' make 2 more conditions for x limits and keep track of scores
        >everytime the ball should start from 0,0 
        >and change speed x to speedx*-1'''
    
    if ball.xcor()>400:
        ball.goto(0,0)
        speedx = speedx*-1
        pointa=pointa+1
        score.clear()
        score.write("Player A: {}   Player B: {}".format(pointa,pointb),font=('arial',24,'bold'))

    elif ball.xcor()<-400:
        ball.goto(0,0)
        speedx = speedx*-1
        pointb=pointb+1
        score.clear()
        score.write("Player A: {}   Player B: {}".format(pointa,pointb),font=('arial',24,'bold'))




    if ball.xcor()>370 and (pedal.ycor()+50> ball.ycor() > pedal.ycor()-50):
        speedx*=-1
        playsound.playsound('bounce.wav')
    elif ball.xcor()<-370 and (pedal2.ycor()+50>ball.ycor() > pedal2.ycor()-50):
        speedx*=-1
        playsound.playsound('bounce.wav')


turtle.done()
```

> * MakeMyTrip <br> 
> <img src="{{ site.baseurl }}/assets/mmt.gif" width="400" height="150" />

### `My Progress`  ![](https://progress-bar.dev/53)
#### `Batches Owned:` 🌟🧠⚓
