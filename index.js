const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './sprites/oak_woods_v1.0/background/background.png'
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './sprites/oak_woods_v1.0/decorations/shop_anim.png',
  scale: 2.75,
  framesMax: 6
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './sprites/Martial Hero/Sprites/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  },
  sprites: {
    idle: {
      imageSrc: './sprites/Martial Hero/Sprites/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './sprites/Martial Hero/Sprites/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './sprites/Martial Hero/Sprites/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './sprites/Martial Hero/Sprites/Fall.png',
      framesMax: 2,
    }
  }
});

// player.draw();

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
});

// enemy.draw();

// console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //  player movement
  player.switchSprites('idle');
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprites('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprites('run');
  } else {
    player.switchSprites('idle');
  }
  // jumpando
  if(player.velocity.y < 0) {
    player.switchSprites('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprites('fall');
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
  }

  // detect for colission
  if (
    rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    // console.log('tapa');
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  if (
    rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log('soco');
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }

};

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -20;
      break;
    case ' ':
      player.attack();
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown':
      enemy.attack();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});