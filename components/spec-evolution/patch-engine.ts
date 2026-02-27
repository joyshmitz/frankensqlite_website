/**
 * Applies a unified diff patch to an array of lines.
 * Ported from the original spec evolution viewer's applySynapticPatch.
 */
export function applySynapticPatch(lines: string[], patch: string): string[] {
  const out = lines.slice();
  const patchLines = patch.split("\n");
  let offset = 0;

  for (let i = 0; i < patchLines.length; i++) {
    const line = patchLines[i];
    if (line.startsWith("@@")) {
      const m = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (m) {
        const os = parseInt(m[1]);
        const oc = parseInt(m[2] || "1");
        const startPos = os - 1 + offset;
        const newSeg: string[] = [];
        i++;
        while (
          i < patchLines.length &&
          patchLines[i] !== undefined &&
          !patchLines[i].startsWith("@@")
        ) {
          const row = patchLines[i];
          if (row.startsWith("+")) newSeg.push(row.slice(1));
          else if (!row.startsWith("-")) newSeg.push(row.slice(1));
          i++;
        }
        i--;

        const CHUNK_SIZE = 5000;
        if (newSeg.length > CHUNK_SIZE) {
          out.splice(startPos, oc);
          for (let j = 0; j < newSeg.length; j += CHUNK_SIZE) {
            const chunk = newSeg.slice(j, j + CHUNK_SIZE);
            out.splice(startPos + j, 0, ...chunk);
          }
        } else {
          out.splice(startPos, oc, ...newSeg);
        }

        offset += parseInt(m[4] || "1") - oc;
      }
    }
  }
  return out;
}

/**
 * Strips markdown formatting from a line of text for comparison purposes.
 */
export function stripMd(text: string): string {
  return text
    .replace(/^#+\s+/, "")
    .replace(/^[*+-]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/^>\s+/, "")
    .replace(/[*_~`]/g, "")
    .trim();
}
