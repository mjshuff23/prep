import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const legacyRoot = path.join(process.cwd(), 'legacy/javascript-info-review')

function collectPlaygroundHtmlFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      if (entry === 'node_modules') return []
      return collectPlaygroundHtmlFiles(fullPath)
    }

    return entry === 'playground.html' ? [fullPath] : []
  })
}

function relativeToRepo(filePath: string): string {
  return path.relative(process.cwd(), filePath).split(path.sep).join('/')
}

function lineForIndex(source: string, index: number): number {
  return source.slice(0, index).split('\n').length
}

function scriptSrcs(html: string): string[] {
  return [...html.matchAll(/<script\b([^>]*)>/gi)]
    .map(([, attrs]) => attrs?.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1])
    .filter((src): src is string => Boolean(src))
}

describe('legacy JavaScript.info playground scripts', () => {
  const playgrounds = collectPlaygroundHtmlFiles(legacyRoot)

  it('keeps browser playground JavaScript in external files', () => {
    const inlineScriptLocations = playgrounds.flatMap((filePath) => {
      const html = readFileSync(filePath, 'utf8')

      return [...html.matchAll(/<script\b(?![^>]*\bsrc\s*=)[^>]*>[\s\S]*?<\/script>/gi)].map(
        (match) => `${relativeToRepo(filePath)}:${lineForIndex(html, match.index ?? 0)}`,
      )
    })

    expect(inlineScriptLocations).toEqual([])
  })

  it('imports readable JavaScript files with TypeScript sidecars', () => {
    const missingFiles = playgrounds.flatMap((filePath) => {
      const html = readFileSync(filePath, 'utf8')
      const folder = path.dirname(filePath)
      const srcs = scriptSrcs(html).filter((src) => src.endsWith('.js'))
      const relativeHtml = relativeToRepo(filePath)
      const missingForPlayground =
        srcs.length === 0 ? [`${relativeHtml} does not import any .js playground script`] : []

      return [
        ...missingForPlayground,
        ...srcs.flatMap((src) => {
          const jsPath = path.join(folder, src)
          const tsPath = path.join(folder, src.replace(/\.js$/u, '.ts'))
          return [
            existsSync(jsPath) ? undefined : `${relativeHtml} imports missing ${src}`,
            existsSync(tsPath) ? undefined : `${relativeHtml} imports ${src} without ${path.basename(tsPath)}`,
          ].filter((message): message is string => Boolean(message))
        }),
      ]
    })

    expect(missingFiles).toEqual([])
  })
})
