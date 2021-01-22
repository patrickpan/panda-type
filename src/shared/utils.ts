import { useMemo } from "react";
import Highcharts from "highcharts";

const WORD_LIST = [
  "the",
  "be",
  "of",
  "and",
  "a",
  "to",
  "in",
  "he",
  "have",
  "it",
  "that",
  "for",
  "they",
  "I",
  "with",
  "as",
  "not",
  "on",
  "she",
  "at",
  "by",
  "this",
  "we",
  "you",
  "do",
  "but",
  "from",
  "or",
  "which",
  "one",
  "would",
  "all",
  "will",
  "there",
  "say",
  "who",
  "make",
  "when",
  "can",
  "more",
  "if",
  "no",
  "man",
  "out",
  "other",
  "so",
  "what",
  "time",
  "up",
  "go",
  "about",
  "than",
  "into",
  "could",
  "state",
  "only",
  "new",
  "year",
  "some",
  "take",
  "come",
  "these",
  "know",
  "see",
  "use",
  "get",
  "like",
  "then",
  "first",
  "any",
  "work",
  "now",
  "may",
  "such",
  "give",
  "over",
  "think",
  "most",
  "even",
  "find",
  "day",
  "also",
  "after",
  "way",
  "many",
  "must",
  "look",
  "before",
  "great",
  "back",
  "through",
  "long",
  "where",
  "much",
  "should",
  "well",
  "people",
  "down",
  "own",
  "just",
  "because",
  "good",
  "each",
  "those",
  "feel",
  "seem",
  "how",
  "high",
  "too",
  "place",
  "little",
  "world",
  "very",
  "still",
  "nation",
  "hand",
  "old",
  "life",
  "tell",
  "write",
  "become",
  "here",
  "show",
  "house",
  "both",
  "between",
  "need",
  "mean",
  "call",
  "develop",
  "under",
  "last",
  "right",
  "move",
  "thing",
  "general",
  "school",
  "never",
  "same",
  "another",
  "begin",
  "while",
  "number",
  "part",
  "turn",
  "real",
  "leave",
  "might",
  "want",
  "point",
  "form",
  "off",
  "child",
  "few",
  "small",
  "since",
  "against",
  "ask",
  "late",
  "home",
  "interest",
  "large",
  "person",
  "end",
  "open",
  "public",
  "follow",
  "during",
  "present",
  "without",
  "again",
  "hold",
  "govern",
  "around",
  "possible",
  "head",
  "consider",
  "word",
  "program",
  "problem",
  "however",
  "lead",
  "system",
  "set",
  "order",
  "eye",
  "plan",
  "run",
  "keep",
  "face",
  "fact",
  "group",
  "play",
  "stand",
  "increase",
  "early",
  "course",
  "change",
  "help",
  "line",
];

export const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLessMinutes = seconds % 60;
  const isAtLeastAMinute = minutes >= 1;

  if (isAtLeastAMinute) {
    if (secondsLessMinutes === 0) return `${minutes}m`;

    return `${minutes}m ${seconds % 60}s`;
  }

  return `${seconds}s`;
};

export const getRandomWord = () => {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
};

export const generateWords = (numWords: number) => {
  // get range of indexes representing all words in the list
  const range = Array(WORD_LIST.length)
    .fill(null)
    .map(($, index) => index);
  // jumble it up...
  range.sort(() => 1 - Math.random() * 2);

  // this gets us a set of words with no repeats
  return range.slice(0, numWords).map((index) => WORD_LIST[index]);
};

export const generateChartData = (graphData: Array<[number, number]>, hideLabels?: boolean): Highcharts.Options => ({
  chart: {
    backgroundColor: "#232425",
    height: 320,
    width: 600,
  },
  noData: {
    style: {
      fontSize: "15px",
      color: "white",
    },
  },
  plotOptions: {
    line: {
      marker: { enabled: false },
    },
  },
  title: { text: "" },
  tooltip: {
    formatter() {
      return `${formatSeconds(this.point.x)} – <b>${this.point.y} WPM</b>`;
    },
  },
  xAxis: {
    startOnTick: false,
    endOnTick: false,
    visible: false,
  },
  yAxis: {
    gridLineColor: "#555555",
    title: { text: "" },
    labels: { style: { fontSize: "15px", color: "white" } },
    visible: !hideLabels,
    min: 0,
  },
  series: [
    {
      color: "#edbe3e",
      showInLegend: false,
      name: "WPM",
      type: "line",
      data: graphData.slice(1).map((data) => data[1]),
    },
  ],
});

export const useGenerateId = (() => {
  let counter = 0;

  return () => {
    const suffix = useMemo(() => ++counter, []);

    return (id: string) => `${id}-${suffix}`;
  };
})();
