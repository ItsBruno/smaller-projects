import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.Timer;


public class Board extends JPanel{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int WIDTH = 600;
	private int HEIGHT = 600;
	private int APPLE_POS = 29;
	private int UNIT = 20;
	
	private int appleX;
	private int appleY;
	
	private int score = 0;
	
	private ImageIcon snakeHeadIconUP;
	private ImageIcon snakeHeadIconRIGHT;
	private ImageIcon snakeHeadIconDOWN;
	private ImageIcon snakeHeadIconLEFT;

	private ImageIcon snakeBodyIcon;
	private ImageIcon appleIcon;
	
	private Timer timer;
	private int GAME_SPEED_DELAY = 250;
	
	private Direction direction = Direction.RIGHT;
	private static Direction previousDirection = Direction.RIGHT;
	private Snake snake;
	
	private DirectionKeyListener dkl;
	
	private boolean gameOver = false;
	
	//Initialize board
	
	public Board() {
		setPreferredSize(new Dimension(WIDTH, HEIGHT));
		setBackground(Color.BLACK);
	
		loadImages();
		snake = new Snake(WIDTH, HEIGHT, UNIT);
		setAppleLocation();
		
		dkl = new DirectionKeyListener();
		
		addKeyListener(dkl);
		
		//setFocusable(true);
		//requestFocusInWindow();
		
		//Run the game
		
		timer = new Timer(GAME_SPEED_DELAY, new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				
				checkCollision();
				snake.moveSnake(direction);
				checkApple();
				if(!gameOver) repaint();
			}
		});
		timer.start();

	}
	
	//load images of elements
	
	public void loadImages() {
		
		snakeHeadIconUP = new ImageIcon("resources\\20x20\\head\\snake_head_20x20_UP.png");
		snakeHeadIconRIGHT = new ImageIcon("resources\\20x20\\head\\snake_head_20x20_RIGHT.png");
		snakeHeadIconDOWN = new ImageIcon("resources\\20x20\\head\\snake_head_20x20_DOWN.png");
		snakeHeadIconLEFT = new ImageIcon("resources\\20x20\\head\\snake_head_20x20_LEFT.png");

		snakeBodyIcon = new ImageIcon("resources\\20x20\\snake_body20x20.png");
		appleIcon = new ImageIcon("resources\\20x20\\apple20x20PIXELATED.png");
		
	}
	
	public void setAppleLocation() {
		
		appleX = ((int) (APPLE_POS * Math.random())) * UNIT;
		appleY = ((int) (APPLE_POS * Math.random())) * UNIT;
		
		//Check and correct if apple spawned inside snake
		
		for(int i = 0; i < snake.getSnakeSegments().size(); i++) {
			if(appleX == snake.getSnakeSegments().get(i).getX() && appleY == snake.getSnakeSegments().get(i).getY()) {
				setAppleLocation();
			}
		}
		
	}
	
	//Draw the apple and snake
	
	@Override
	
	public void paintComponent(Graphics g) {
		super.paintComponent(g);
		
		g.drawImage(appleIcon.getImage(), appleX, appleY, this);
		
		if(direction == Direction.UP) snake.drawSnake(g, snakeHeadIconUP.getImage(), snakeBodyIcon.getImage(), this);
		if(direction == Direction.RIGHT) snake.drawSnake(g, snakeHeadIconRIGHT.getImage(), snakeBodyIcon.getImage(), this);
		if(direction == Direction.DOWN) snake.drawSnake(g, snakeHeadIconDOWN.getImage(), snakeBodyIcon.getImage(), this);
		if(direction == Direction.LEFT) snake.drawSnake(g, snakeHeadIconLEFT.getImage(), snakeBodyIcon.getImage(), this);
		
	}
	
	//check if snake collided with:
	
	public void checkCollision() {
		
		//border
		
		if(snake.getSnakeSegments().get(0).getY() < 0) gameOver = true;
		else if(snake.getSnakeSegments().get(0).getY() > HEIGHT - UNIT) gameOver = true;
		else if(snake.getSnakeSegments().get(0).getX() < 0) gameOver = true;
		else if(snake.getSnakeSegments().get(0).getX() > WIDTH - UNIT) gameOver = true;
		
		//itself
		
		for(int i = 1; i < snake.getSnakeSegments().size(); i++) {
			if(snake.getSnakeSegments().get(0).equals(snake.getSnakeSegments().get(i))) gameOver = true;
			System.out.println("Collision with body segment: " + i + " " + snake.getSnakeSegments().get(0).equals(snake.getSnakeSegments().get(i)));
		}
	
		if(gameOver == true) {
			timer.stop();
			System.out.println("GAME OVER");
		}
	}
	
	public void checkApple() {
		if(snake.getSnakeSegments().get(0).getX() == appleX && snake.getSnakeSegments().get(0).getY() == appleY) {
			snake.growSnake();
			score++;
			setAppleLocation();
		}
	}
	
	

	public static void setPreviousDirection(Direction previousDirection) {
		Board.previousDirection = previousDirection;
	}

	// Keyboard input

	class DirectionKeyListener implements KeyListener {

		@Override
		public void keyTyped(KeyEvent e) {
		}

		@Override
		public void keyPressed(KeyEvent e) {
			
			int key = e.getKeyCode();
			
			// check if movement is legal and change direction
			
			if(key == KeyEvent.VK_W && previousDirection != Direction.DOWN) {
				direction = Direction.UP;
			}
			else if(key == KeyEvent.VK_S && previousDirection != Direction.UP) {
				direction = Direction.DOWN;
			}
			else if(key == KeyEvent.VK_A && previousDirection != Direction.RIGHT) {
				direction = Direction.LEFT;
			}
			else if(key == KeyEvent.VK_D && previousDirection != Direction.LEFT) {
				direction = Direction.RIGHT;
			}
			 //previousDirection = direction;
			
		}

		@Override
		public void keyReleased(KeyEvent e) {
			// TODO Auto-generated method stub
			
		}
		
	}

	public int getScore() {
		return score;
	}

	
	
}
