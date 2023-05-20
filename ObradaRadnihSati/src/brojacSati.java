import java.io.File;
import java.io.FileNotFoundException;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Map.Entry;
import java.util.Scanner;
import java.util.function.ToDoubleFunction;


public class brojacSati {
	
	private static double workHours = 0;
	private static Map<LocalDate, LocalTime[]> workDataStatic = new LinkedHashMap<>();
	private static Double wagePerHour = 0.;

	private static Map<LocalDate, LocalTime[]> parseWorkData(File file) {
		
		Map<LocalDate, LocalTime[]> workData = new LinkedHashMap<>();
		
		Scanner sc = null;
		
		try {
			sc = new Scanner(file);
		} catch (FileNotFoundException e) {
			System.out.println("No such file");
			e.printStackTrace();
		}
		
		while(sc.hasNext()) {
			String currLine = sc.nextLine();
		
			List<String> list = Arrays.asList(currLine.split("-"));
						
			LocalDate date = LocalDate.of(LocalDate.now().getYear(), Integer.valueOf(list.get(0).split("\\.")[1].strip()), Integer.valueOf(list.get(0).split("\\.")[0]));
			
			LocalTime[] startStopTimes = new LocalTime[2];
			
			startStopTimes[0] = LocalTime.of(Integer.valueOf(list.get(1).split(":")[0].strip()), Integer.valueOf(list.get(1).split(":")[1].strip()));
			startStopTimes[1] = LocalTime.of(Integer.valueOf(list.get(2).split(":")[0].strip()), Integer.valueOf(list.get(2).split(":")[1].strip()));
			
			workData.put(date, startStopTimes);
		}
		
		sc.close();
		
		return workData;
	}
	
	private static Double timeDifference(LocalTime time1, LocalTime time2) {
		
		Double difference = 0.;
		
		int stopHour = time2.getHour();
		
		if(stopHour < 6) {
			difference = 24 - time1.getHour() + (Double.valueOf((0 - time1.getMinute())) / 60);
			difference += time2.getHour() + (Double.valueOf(time2.getMinute()) / 60);
		}
		else {
		
			/* take the difference between the hours and add the minute difference percentage to it */
			
			Integer hourDifference = Math.abs(time1.getHour() - time2.getHour());
			Integer minuteDifference = time2.getMinute() - time1.getMinute();
			
			difference = hourDifference + Double.valueOf(minuteDifference) / 60;
		}
		
		return Math.round(difference * 100) / 100.;
	}
	
	private static Double countWorkHours(Map<LocalDate, LocalTime[]> workData) {
		
		return workData.entrySet().stream().mapToDouble(new ToDoubleFunction<Entry<LocalDate, LocalTime[]>>() {

			@Override
			public double applyAsDouble(Entry<LocalDate, LocalTime[]> workDataForDate) {
				
				return timeDifference(workDataForDate.getValue()[0], workDataForDate.getValue()[1]);
			}
			
		}).sum();
	}
	
	private static void printTotalHours() {
		System.out.println(workHours);
	}
	
	private static void printAllTimeData() {
		workDataStatic.entrySet().stream().forEach(e -> System.out.println(e.getKey() + " - " + e.getValue()[0] + ":" + e.getValue()[1]));
	}
	
	private static void printWorkHoursForEachDay() {
		workDataStatic.entrySet().stream().forEach(e -> System.out.println(e.getKey() + " - " + timeDifference(e.getValue()[0], e.getValue()[1])));
	}
	
	private static Double calculateTotalMoneyEarned() {
		return workHours * wagePerHour;
	}
	
	public static void main(String[] args) {
		
		File podaci_o_radu = new File("podaci_o_radu\\Radni sati svi.txt");
		
		workDataStatic = parseWorkData(podaci_o_radu);
		
		
		Scanner inputScanner = new Scanner(System.in);
		
		System.out.println("Program started!\nType \"*help\" for the list of commands");
		
		String caseStr = "";
		workHours = countWorkHours(workDataStatic);
		
		while(!caseStr.equals("exit")) {
			
			caseStr = inputScanner.next();				
			
			switch (caseStr) {
				case "*total_hours": {
					printTotalHours(); 
					break;
				}
				case "exit": {
					break;
				}
				case "*help": {
					System.out.println("exit - exits the program\n"
							+ "*help - displays the list of commands\n"
							+ "*total_hours - displays the total hours worked\n"
							+ "*all_clock_times - displays all dates with that dates clock in and out times\n"
							+ "*hours_for_every_day - displays all worked days with total hours worked for that day\n"
							+ "*total_earned - displayes total money earned\n"
							+ "*hours_for_day - displayes total hours worked for given date. Date must be\n                 in format \"dd.mm\"");
					break;
				}
				case "*all_clock_times": {
					printAllTimeData();
					break;
				}
				case "*hours_for_every_day": {
					printWorkHoursForEachDay();
					break;
				}
				case "*total_earned": {
					
					if(wagePerHour == 0.) {
						System.out.println("Enter your hourly wage > ");
						
						try {
							wagePerHour = inputScanner.nextDouble();
							
						}
						catch(NoSuchElementException exc) {
							System.out.println("Illegal input try again! Number value required.");
						}
					}
					System.out.println(calculateTotalMoneyEarned() + " kn");
					break;
				}
				
				case "*hours_for_day": {
					System.out.println("Enter date >");
					boolean correctInput = false;
					while(!correctInput) {
						try {
							String date = inputScanner.next();
							LocalDate dateOfStr = LocalDate.of(LocalDate.now().getYear(),Integer.valueOf(date.split("\\.")[1]),Integer.valueOf(date.split("\\.")[0]));
							LocalTime[] times = workDataStatic.get(dateOfStr);
							
							if(times == null) {
								throw new NoSuchElementException();
							}
							else {
								System.out.println(dateOfStr + " - " + timeDifference(times[0], times[1]));
								correctInput = true;
							}
							
						}
						
						catch(NumberFormatException | DateTimeException | NoSuchElementException | ArrayIndexOutOfBoundsException exc) {
							
							if(exc instanceof NumberFormatException) {
								System.out.println("Incorrect input!\nEnter new date > ");
							}
							else if(exc instanceof DateTimeException) {
								System.out.println("Invalid date!\nEnter new date >  ");
							}
							else if(exc instanceof NoSuchElementException) {
								System.out.println("No data for given date\nEnter new date > ");
							} 
							else if(exc instanceof ArrayIndexOutOfBoundsException) {
								System.out.println("Wrong format! Enter new date > ");
							}
						}
						
					}
					break;
				}
				
				default:
					System.out.println("Unknown command");
					break;
				}
		}
		
		System.out.println("Program terimnated");
		
		inputScanner.close();
		
	}
	
}
