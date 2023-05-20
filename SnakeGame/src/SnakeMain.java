import java.awt.BorderLayout;
import java.lang.reflect.InvocationTargetException;

import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class SnakeMain extends JFrame{

	private static final long serialVersionUID = 1L;
	private JPanel contentPanel;
	//private JTextField score = new JTextField();     score field - unfinished
	private Board board;
	private JDialog dialog = new JDialog();

	public SnakeMain() {
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		contentPanel = (JPanel) getContentPane();
		
		BorderLayout layout = new BorderLayout();
		
		contentPanel.setLayout(layout);		
		
		//score.setEditable(false);
		
		board = new Board();
		
		contentPanel.add(board, BorderLayout.CENTER);
		//contentPanel.add(score, BorderLayout.NORTH);
		
		board.setFocusable(true);
		board.requestFocusInWindow();
		board.grabFocus();
		//System.out.println(board.hasFocus());
		
		//score.setText(String.valueOf(board.getScore()));
		
		//System.out.println(getFocusOwner());
	}
	
	public static void main(String[] args) {
		
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				
				@Override
				public void run() {
					
					SnakeMain snekWindow = new SnakeMain();
					snekWindow.setLocationRelativeTo(null);
					snekWindow.pack();
					snekWindow.setResizable(false);
					snekWindow.setTitle("Snake");
					snekWindow.setVisible(true);
					
				}
			});
		} catch (InvocationTargetException | InterruptedException e) {
			e.printStackTrace();
		}
		
	}
}
