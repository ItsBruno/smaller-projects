import java.awt.Graphics;
import java.awt.Image;
import java.util.LinkedList;
import java.util.Objects;

public class Snake {

	private LinkedList<SnakeSegment> snake;
	private int width, height, unit;
	private boolean grow = false;
	
	public Snake(int width, int height, int unit) {
		
		snake = new LinkedList<>();
		this.width = width;
		this.height = height;
		this.unit = unit;
		
		
		for(int i = 0; i < 3; i++) {
			snake.add(new SnakeSegment(40 - unit*i, 40));
		}
	}
	
	public LinkedList<SnakeSegment> getSnakeSegments() {
		return snake;
	}
	
	public void drawSnake(Graphics g, Image head, Image body, Board board) {
		g.drawImage(head, snake.get(0).x, snake.get(0).y, board);
		for(SnakeSegment ss : snake) {
			if(snake.indexOf(ss) == 0) continue;
			else {
				g.drawImage(body, ss.x, ss.y, board);
				System.out.println("Body " + snake.indexOf(ss) + " " + ss.x + " " + ss.y);
			}
		}
	}
	
	public void growSnake() {
		grow = true;
	}
	
	public void moveSnake(Direction moveDirection) {
		
		
		SnakeSegment newSgmnt = new SnakeSegment(snake.get(0).x, snake.get(0).y);
		snake.add(0, newSgmnt);
		
		if(!grow) {
			snake.removeLast();
		}
		
		grow = false;
		
		switch (moveDirection) {
		case UP: {
			newSgmnt.setY(newSgmnt.getY() - unit);
			Board.setPreviousDirection(Direction.UP);
			break;
		}
		case DOWN: {
			newSgmnt.setY(newSgmnt.getY() + unit);
			Board.setPreviousDirection(Direction.DOWN);

			break;
		}
		case RIGHT: {
			newSgmnt.setX(newSgmnt.getX() + unit);
			Board.setPreviousDirection(Direction.RIGHT);

			break;
		}
		case LEFT: {
			newSgmnt.setX(newSgmnt.getX() - unit);
			Board.setPreviousDirection(Direction.LEFT);

			break;
		}
		default:
			throw new IllegalArgumentException("Unexpected value: " + moveDirection);
		}
	}
	
	class SnakeSegment {
		
		private int x;
		private int y;
		
		public SnakeSegment(int x, int y) {
			this.x = x;
			this.y = y;
		}

		public int getX() {
			return x;
		}

		public void setX(int x) {
			this.x = x;
		}

		public int getY() {
			return y;
		}

		public void setY(int y) {
			this.y = y;
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			SnakeSegment other = (SnakeSegment) obj;
			if (!getEnclosingInstance().equals(other.getEnclosingInstance()))
				return false;
			return x == other.x && y == other.y;
		}

		private Snake getEnclosingInstance() {
			return Snake.this;
		}
	}
}
