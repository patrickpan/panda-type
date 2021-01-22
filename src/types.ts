import Highcharts from "highcharts";

export interface ResultData {
  accuracy: number;
  graphData: Highcharts.Options;
  rawWpm: number;
  timeTaken: number;
  wpm: number;
}
