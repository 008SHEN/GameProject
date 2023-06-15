const canvas = document.getElementById("starwar");
const ctx = canvas.getContext('2d');

canvas.height = 900;
canvas.width = 1600;

class Gamer {
  constructor() {
    this.speed = {
      x: 0,
      y: 0
    };
    this.position = {
      x: 399,
      y: 800
    };
    this.health = 1; 

    this.image = new Image();
    this.image.onload = () => {
      this.draw();
    };
    this.image.src = 'imgsound/sw1.png';

    this.width = 60;
    this.height = 60;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  checkCollision(bullet) {
    const enemy = group.enemies.find(enemy => {
      return (
        bullet.x < enemy.position.x + enemy.width &&
        bullet.x + bullet.width > enemy.position.x &&
        bullet.y < enemy.position.y + enemy.height &&
        bullet.y + bullet.height > enemy.position.y
      );
    });
    if (enemy) {
      group.enemies = group.enemies.filter(e => e !== enemy);
      if (group.enemies.length === 0) {
        window.alert("You defeat the TIE fighter squadron, may the force be with you!");
      }
      return true;
    }
  
    return false;
  }



  checkEnemyBulletCollision(enemyBullet) {
    if (
      enemyBullet.x < this.position.x + this.width &&
      enemyBullet.x + enemyBullet.width > this.position.x &&
      enemyBullet.y < this.position.y + this.height &&
      enemyBullet.y + enemyBullet.height > this.position.y
    ) {
      this.health--; 
      if (this.health <= 0) {
        gameOver = true; 
      }
      return true;
    }
    return false;
  }


  


  update() {
    this.draw();
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x + this.width > canvas.width) {
      this.position.x = canvas.width - this.width;
    }

    if (this.position.y < 0) {
      this.position.y = 0;
    } else if (this.position.y + this.height > canvas.height) {
      this.position.y = canvas.height - this.height;
    }
  }
}


class Enemy {
  constructor({ position }) {
    this.speed = {
      x: 0.5,
      y: 0.06
    };
    this.position = {
      x: position.x,
      y: position.y
    };

    this.image = new Image();
    this.image.onload = () => {
      this.draw();
    };
    this.image.src = 'imgsound/swp2.png';

    this.width = 50;
    this.height = 40;
  }
  createEnemyBullet() {
    const enemyBullet = new EnemyBullet({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
      speed: {
        x: 0,
        y: 2
      },
      canvas: canvas
    });
  
    bullets2.push(enemyBullet);
  }

  


  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }


  update() {
    this.draw();

 
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.x < 0 || this.position.x + this.width > canvas.width) {
      this.speed.x *= -1;
    }

    if (this.position.y < 0 || this.position.y + this.height > canvas.height) {
      this.speed.y *= -1;


    }
  }
}


class Group {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    };
    this.speed = {
      x: 0.5,
      y: 0
    };
    this.enemies = []; 
    const row = Math.floor(Math.random() * 4+3); 
    const line = Math.floor(Math.random() * 6+8);
    for (let x = 0; x < line; x++) {
      for (let y = 0; y < row; y++) {
        this.enemies.push(new Enemy({
          position: {
            x: x * 60,
            y: y * 50
          }
        }));
      }
    }
  }

  update() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  // set bullet number 
    this.enemies.forEach(enemy => {
      enemy.update();
      if (Math.random() < 0.001) {
        enemy.createEnemyBullet();
      }
    });
  }
}

class Bullet {
  constructor({ position, speed, canvas }) {
    this.position = position;
    this.canvas = canvas;
    this.speed = speed;
    this.width = 3;
    this.height = 5;
    this.x = position.x;
    this.y = position.y;
    this.shootSound = new Audio('imgsound/tie.mp3');
  }

  draw() {
    this.y += this.speed.y;
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  update() {
    this.draw();
    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  playShootSound() {
    this.shootSound.currentTime = 0; 
    this.shootSound.play();
  }

}



class EnemyBullet {
  constructor({ position, speed, canvas }) {
    this.position = position;
    this.canvas = canvas;
    this.speed = speed;
    this.width = 3;
    this.height = 3;
    this.x = position.x;
    this.y = position.y;
    this.shootSound = new Audio('imgsound/tie.mp3');
  
  }

  draw() {
    this.y += this.speed.y;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  update() {
    this.draw();
    this.x += this.speed.x;
    this.y += this.speed.y;
  }
  playShootSound() {
    this.shootSound.currentTime = 0; 
    this.shootSound.play();
  }
}





let gamer = new Gamer();

let bullets = [];
let bullets2=[]
let group = new Group(); 
let gameOver = false; 

function createBullet() {
  const bullet = new Bullet({
    position: {
      x: gamer.position.x + gamer.width / 2,
      y: gamer.position.y
    },
    speed: {
      x: 0,
      y: -2
    },
    canvas: canvas
  });


  bullet.playShootSound();

  bullets.push(bullet);
}

let keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  }
};


function animate() {
  requestAnimationFrame(animate);

  if (gameOver) {
   
    window.alert("Dark side is more powerful!");
    return;
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  gamer.update();

  bullets = bullets.filter(bullet => {
    bullet.update();
    return bullet.y >= 0;
  });
  bullets.forEach(bullet => {
    if (gamer.checkCollision(bullet)) {
      bullets = bullets.filter(b => b !== bullet);
    }
    bullet.update();
  });

  bullets2 = bullets2.filter(enemyBullet => {
    enemyBullet.update();
    if (gamer.checkEnemyBulletCollision(enemyBullet)) {
      bullets2 = bullets2.filter(b => b !== enemyBullet);
    }
    return enemyBullet.y <= canvas.height;
  });

  group.update();

  if (keys.a.pressed && gamer.position.x >= 0) {
    gamer.speed.x = -2;
  } else if (keys.d.pressed && gamer.position.x + gamer.width <= canvas.width) {
    gamer.speed.x = 2;
  } else {
    gamer.speed.x = 0;
  }

  if (keys.w.pressed && gamer.position.y >= 0) {
    gamer.speed.y = -1;
  } else if (keys.s.pressed && gamer.position.y + gamer.height <= canvas.height) {
    gamer.speed.y = 1;
  } else {
    gamer.speed.y = 0;
  }

  
}
document.getElementById('startButton').addEventListener('click', () => {
  animate();
});


// animate();

addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
      console.log('left');
      keys.a.pressed = true;
      break;
    case 'd':
      console.log('right');
      keys.d.pressed = true;
      break;
    case 'f':
      console.log('shoot');
      createBullet();
      break;
      case 'w':
        console.log('up');
        keys.w.pressed = true;
        break;
      case 's':
        console.log('down');
        keys.s.pressed = true;
        break;
  }
});

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      console.log('left');
      keys.a.pressed = false;
      break;
    case 'd':
      console.log('right');
      keys.d.pressed = false;
      break;
      case 'w':
      console.log('up');
      keys.w.pressed = false;
      break;
    case 's':
      console.log('down');
      keys.s.pressed = false;
      break;


  }
});



