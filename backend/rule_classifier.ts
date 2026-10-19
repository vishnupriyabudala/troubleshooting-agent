/**
 * TechAssist AI - Rule Classifier Engine
 * Processes natural language problem descriptions into technical categories and matched problem templates.
 */

export interface ClassificationResult {
  category: string;
  problemId: string | null;
  confidence: number;
  needsClarification: boolean;
  clarificationMessage: string | null;
  matchedKeywords: string[];
}

export const CLASSIFICATION_RULES: Record<
  string,
  {
    keywords: string[];
    problemMappings: Record<string, string[]>;
  }
> = {
  Network: {
    keywords: [
      'wifi', 'wi-fi', 'internet', 'network', 'router', 'modem', 'dns', 'ping',
      'ip address', 'lan', 'wlan', 'ssid', 'connection', 'websites not opening',
      'cannot open site', 'no internet', 'gateway', 'dhcp', 'bandwidth', 'ethernet'
    ],
    problemMappings: {
      'wifi-no-internet': [
        'connected to wifi but no internet',
        'wifi connected no internet',
        'websites are not opening',
        'no internet',
        'cannot access internet',
        'websites wont load',
        "wifi isn't working",
        'dns',
        "can't access the internet",
        'connected to wi-fi but websites are not opening',
        'connected but no internet'
      ]
    }
  },
  Hardware: {
    keywords: [
      'overheating', 'hot', 'fan', 'fan noise', 'burning', 'battery', 'keyboard',
      'charger', 'power', 'screen flickering', 'hinge', 'thermal', 'cooling', 'temp'
    ],
    problemMappings: {
      'laptop-overheating': [
        'laptop is extremely hot',
        'overheating',
        'hot laptop',
        'fan spinning loudly',
        'fan noise',
        'laptop shuts down when hot',
        'loud fan',
        'thermal throttle',
        'burning hot'
      ]
    }
  },
  Performance: {
    keywords: [
      'slow', 'lag', 'lagging', 'freezing', 'freeze', 'stuck', 'unresponsive',
      'spinning wheel', 'ram', 'high memory', '100% disk', 'cpu 100', 'boot slow', 'sluggish'
    ],
    problemMappings: {
      'laptop-slow-performance': [
        'laptop is slow',
        'laptop running slow',
        'computer is slow',
        'freezing',
        'lagging',
        'taking long time to open',
        'apps hang',
        'spinning circle',
        '100% disk'
      ]
    }
  },
  Browser: {
    keywords: [
      'browser', 'chrome', 'firefox', 'edge', 'safari', 'aw snap', 'tab crash',
      'tabs closing', 'extensions', 'incognito', 'web page crash'
    ],
    problemMappings: {
      'browser-crashes': [
        'chrome keeps closing',
        'browser keeps crashing',
        'tabs keep crashing',
        'browser closing unexpectedly',
        'chrome freezes',
        'aw snap'
      ]
    }
  },
  Printer: {
    keywords: [
      'printer', 'print', 'printing', 'spooler', 'paper jam', 'ink', 'toner',
      'printer offline', 'not printing'
    ],
    problemMappings: {
      'printer-failure': [
        'printer is connected but not printing',
        'printer offline',
        'cannot print',
        'print queue stuck',
        'printer not responding',
        'printer stopped printing'
      ]
    }
  },
  Software: {
    keywords: [
      'app', 'software', 'program', 'application', 'crash', 'crashes', 'dll',
      'vcruntime', 'not responding', 'error code', "won't open", 'wont launch'
    ],
    problemMappings: {
      'software-crashes': [
        'application keeps crashing',
        "app won't open",
        'missing dll',
        'software crash',
        'program closes immediately',
        'msvcp140',
        'vcruntime140'
      ]
    }
  },
  'Operating System': {
    keywords: [
      'windows', 'bsod', 'blue screen', 'boot loop', 'automatic repair',
      'startup repair', 'kernel', 'stop code', 'update failed', 'os', 'recovery'
    ],
    problemMappings: {
      'os-bsod-boot': [
        'blue screen',
        'bsod',
        'boot loop',
        'stuck on startup',
        'automatic repair loop',
        'windows keeps crashing',
        'critical process died'
      ]
    }
  },
  Storage: {
    keywords: [
      'disk full', 'storage', 'low disk space', 'c drive full', 'hard drive',
      'ssd full', 'no space left', 'free up space', 'cleanmgr'
    ],
    problemMappings: {
      'storage-full': [
        'c drive is full',
        'low disk space',
        'storage full',
        'out of space',
        'no space left to download',
        'drive is full'
      ]
    }
  }
};

export function cleanText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function classifyProblem(rawText: string): ClassificationResult {
  const cleaned = cleanText(rawText);
  if (!cleaned) {
    return {
      category: 'Unknown',
      problemId: null,
      confidence: 0,
      needsClarification: true,
      clarificationMessage: 'Please describe the symptoms or error message you are seeing.',
      matchedKeywords: []
    };
  }

  const categoryScores: Record<string, { score: number; matchedKeywords: string[] }> = {};

  for (const [category, data] of Object.entries(CLASSIFICATION_RULES)) {
    let catScore = 0;
    const matched: string[] = [];

    for (const kw of data.keywords) {
      if (` ${cleaned} `.includes(` ${kw} `) || kw === cleaned) {
        catScore += 1.5;
        matched.push(kw);
      } else if (cleaned.includes(kw)) {
        catScore += 0.8;
        matched.push(kw);
      }
    }

    categoryScores[category] = { score: catScore, matchedKeywords: matched };
  }

  // Find highest scoring category
  let bestCategory = 'Unknown';
  let bestScore = 0;
  let bestKeywords: string[] = [];

  for (const [category, data] of Object.entries(categoryScores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestCategory = category;
      bestKeywords = data.matchedKeywords;
    }
  }

  // Check specific problem mappings
  let matchedProblemId: string | null = null;
  let maxMapScore = 0;

  if (bestCategory in CLASSIFICATION_RULES) {
    const mappings = CLASSIFICATION_RULES[bestCategory].problemMappings;
    for (const [pid, phrases] of Object.entries(mappings)) {
      for (const phrase of phrases) {
        if (cleaned.includes(phrase)) {
          const score = (phrase.length / Math.max(cleaned.length, 1)) * 2.0;
          if (score > maxMapScore) {
            maxMapScore = score;
            matchedProblemId = pid;
          }
        }
      }
    }

    // Default to primary problem if strong category match
    if (!matchedProblemId && bestScore >= 1.0) {
      matchedProblemId = Object.keys(mappings)[0];
    }
  }

  // Normalize confidence (0.0 to 0.99)
  const confidence = Math.min(Number(((bestScore + maxMapScore) / 3.0).toFixed(2)), 0.99);

  // Ambiguity or Unknown detection
  if (bestScore < 0.8 || confidence < 0.35) {
    return {
      category: 'Ambiguous / Unknown',
      problemId: null,
      confidence: Math.max(confidence, 0.1),
      needsClarification: true,
      clarificationMessage:
        'I could not confidently identify the technical issue from your description. Could you clarify if this is related to Wi-Fi/Internet, Laptop Hardware/Overheating, System Slowness, Browser, Printer, or Operating System?',
      matchedKeywords: bestKeywords
    };
  }

  return {
    category: bestCategory,
    problemId: matchedProblemId,
    confidence,
    needsClarification: false,
    clarificationMessage: null,
    matchedKeywords: bestKeywords
  };
}
