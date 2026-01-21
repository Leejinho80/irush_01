/**
 * IT 뉴스 크롤링 스크립트
 * ZDNet Korea, 블로터에서 IT 관련 뉴스를 수집합니다.
 * 매일 오전 9시 (KST) GitHub Actions에서 실행됩니다.
 */

import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 뉴스 소스 설정
const NEWS_SOURCES = [
  {
    name: 'ZDNet Korea',
    baseUrl: 'https://zdnet.co.kr',
    listUrl: 'https://zdnet.co.kr/news/?lstcode=0000&page=1',
    articleSelector: 'a[href*="/view/?no="]',
    titleSelector: 'h3',
    contentSelector: '#articleBody, .article_body, .article_txt, .article_content',
    category: 'IT/Tech'
  },
  {
    name: 'ITWorld Korea',
    baseUrl: 'https://www.itworld.co.kr',
    listUrl: 'https://www.itworld.co.kr/news',
    articleSelector: '.node-article',
    titleSelector: 'h2 a, .field-title a',
    contentSelector: '.field-body, .article-body',
    category: 'IT/Tech'
  }
]

// 어제 날짜 구하기 (KST 기준)
function getYesterdayDate() {
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000
  const kstNow = new Date(now.getTime() + kstOffset)
  const yesterday = new Date(kstNow.getTime() - 24 * 60 * 60 * 1000)

  return {
    year: yesterday.getFullYear(),
    month: String(yesterday.getMonth() + 1).padStart(2, '0'),
    day: String(yesterday.getDate()).padStart(2, '0'),
    formatted: `${yesterday.getFullYear()}.${String(yesterday.getMonth() + 1).padStart(2, '0')}.${String(yesterday.getDate()).padStart(2, '0')}`
  }
}

// 오늘 날짜 구하기 (KST 기준)
function getTodayDate() {
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000
  const kstNow = new Date(now.getTime() + kstOffset)

  return {
    year: kstNow.getFullYear(),
    month: String(kstNow.getMonth() + 1).padStart(2, '0'),
    day: String(kstNow.getDate()).padStart(2, '0'),
    formatted: `${kstNow.getFullYear()}.${String(kstNow.getMonth() + 1).padStart(2, '0')}.${String(kstNow.getDate()).padStart(2, '0')}`
  }
}

// HTML 가져오기
async function fetchHTML(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message)
    return null
  }
}

// 본문 내용 추출 및 요약 생성
async function fetchArticleContent(url, contentSelector) {
  const html = await fetchHTML(url)
  if (!html) return null

  const $ = cheerio.load(html)

  // 본문 텍스트 추출
  let content = ''
  $(contentSelector).each((_, el) => {
    content += $(el).text()
  })

  // 텍스트 정리
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim()

  return content
}

// 텍스트 요약 (첫 2-3문장 추출)
function summarizeText(text, maxLength = 200) {
  if (!text) return ''

  // 문장 단위로 분리
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  let summary = ''
  for (const sentence of sentences) {
    if ((summary + sentence).length > maxLength) break
    summary += sentence
  }

  // 요약이 너무 짧으면 글자 수로 자르기
  if (summary.length < 50 && text.length > 0) {
    summary = text.substring(0, maxLength)
    // 마지막 완전한 단어에서 자르기
    const lastSpace = summary.lastIndexOf(' ')
    if (lastSpace > 100) {
      summary = summary.substring(0, lastSpace)
    }
    summary += '...'
  }

  return summary.trim()
}

// ZDNet Korea 크롤링 - 기사 상세 페이지에서 직접 추출
async function crawlZDNet(source, targetDate) {
  const articles = []
  const html = await fetchHTML(source.listUrl)

  if (!html) {
    console.log(`Failed to fetch ${source.name}`)
    return articles
  }

  const $ = cheerio.load(html)
  const seenLinks = new Set()
  const links = []

  // 기사 링크 수집
  $('a').each((_, element) => {
    const href = $(element).attr('href')
    if (href && href.includes('/view/') && !seenLinks.has(href)) {
      seenLinks.add(href)
      let fullLink = href
      if (!fullLink.startsWith('http')) {
        fullLink = source.baseUrl + href
      }
      links.push(fullLink)
    }
  })

  console.log(`  발견된 링크: ${links.length}개`)

  // 각 기사 페이지에서 제목과 본문 추출
  for (const link of links) {
    if (articles.length >= 5) break

    const articleHtml = await fetchHTML(link)
    if (!articleHtml) continue

    const $article = cheerio.load(articleHtml)

    // 제목 추출 (다양한 셀렉터 시도)
    let title = $article('h1.article_title').text().trim() ||
                $article('h1.tit').text().trim() ||
                $article('.article_tit h1').text().trim() ||
                $article('h1').first().text().trim() ||
                $article('title').text().split('|')[0].trim()

    if (!title || title.length < 5) continue

    // 본문 추출
    let content = ''
    $article('#articleBody, .article_body, .article_txt, .article_content').each((_, el) => {
      content += $article(el).text()
    })
    content = content.replace(/\s+/g, ' ').trim()

    const summary = summarizeText(content, 200)

    console.log(`  - 수집: ${title.substring(0, 40)}...`)

    articles.push({
      title: title.replace(/\s+/g, ' ').trim(),
      link,
      source: source.name,
      category: source.category,
      date: targetDate.formatted,
      summary: summary || `${source.name}에서 제공하는 IT 트렌드 기사입니다.`
    })

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`${source.name}: ${articles.length}개 기사 수집 완료`)
  return articles
}

// ITWorld Korea 크롤링 - 기사 상세 페이지에서 직접 추출
async function crawlITWorld(source, targetDate) {
  const articles = []
  const html = await fetchHTML(source.listUrl)

  if (!html) {
    console.log(`Failed to fetch ${source.name}`)
    return articles
  }

  const $ = cheerio.load(html)
  const seenLinks = new Set()
  const links = []

  // 기사 링크 수집 (articleView 패턴)
  $('a').each((_, element) => {
    const href = $(element).attr('href')
    if (href && (href.includes('/news/articleView') || href.includes('/article/')) && !seenLinks.has(href)) {
      seenLinks.add(href)
      let fullLink = href
      if (!fullLink.startsWith('http')) {
        fullLink = source.baseUrl + href
      }
      links.push(fullLink)
    }
  })

  console.log(`  발견된 링크: ${links.length}개`)

  // 각 기사 페이지에서 제목과 본문 추출
  for (const link of links) {
    if (articles.length >= 5) break

    const articleHtml = await fetchHTML(link)
    if (!articleHtml) continue

    const $article = cheerio.load(articleHtml)

    // 제목 추출
    let title = $article('h1.view-article-title').text().trim() ||
                $article('h1.article-title').text().trim() ||
                $article('.article-head h1').text().trim() ||
                $article('h1').first().text().trim() ||
                $article('title').text().split('|')[0].split('-')[0].trim()

    if (!title || title.length < 5) continue

    // 본문 추출 (다양한 셀렉터 시도)
    let content = ''
    $article('#articleBody, .article-body, .view-article-body, #article-view-content-div, .article_body, .field-body, article p, .entry-content').each((_, el) => {
      content += $article(el).text() + ' '
    })
    // 추가로 본문 p태그 직접 시도
    if (content.trim().length < 50) {
      $article('article p, .article p, main p').each((_, el) => {
        content += $article(el).text() + ' '
      })
    }
    content = content.replace(/\s+/g, ' ').trim()

    const summary = summarizeText(content, 200)

    console.log(`  - 수집: ${title.substring(0, 40)}...`)

    articles.push({
      title: title.replace(/\s+/g, ' ').trim(),
      link,
      source: source.name,
      category: source.category,
      date: targetDate.formatted,
      summary: summary || `${source.name}에서 제공하는 IT 트렌드 기사입니다.`
    })

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`${source.name}: ${articles.length}개 기사 수집 완료`)
  return articles
}

// 메인 크롤링 함수
async function crawlAllNews() {
  console.log('=== IT 뉴스 크롤링 시작 ===')
  console.log(`실행 시간: ${new Date().toISOString()}`)

  const targetDate = getYesterdayDate()
  const today = getTodayDate()

  console.log(`수집 대상 날짜: ${targetDate.formatted}`)

  let allArticles = []

  // ZDNet Korea 크롤링
  console.log(`\n[ZDNet Korea 크롤링]`)
  const zdnetArticles = await crawlZDNet(NEWS_SOURCES[0], targetDate)
  allArticles = allArticles.concat(zdnetArticles)

  // ITWorld Korea 크롤링
  console.log(`\n[ITWorld Korea 크롤링]`)
  const itworldArticles = await crawlITWorld(NEWS_SOURCES[1], targetDate)
  allArticles = allArticles.concat(itworldArticles)

  // ID 부여 및 번호 생성
  const trends = allArticles.map((article, index) => ({
    id: index + 1,
    number: String(index + 1).padStart(2, '0'),
    title: article.title,
    category: article.category,
    source: article.source,
    date: article.date,
    link: article.link,
    summary: article.summary
  }))

  // 결과 데이터 구성
  const result = {
    updatedAt: new Date().toISOString(),
    collectionDate: targetDate.formatted,
    displayDate: today.formatted,
    totalCount: trends.length,
    sources: NEWS_SOURCES.map(s => s.name),
    trends
  }

  // JSON 파일로 저장
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'trends.json')

  // 디렉토리가 없으면 생성
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')

  console.log(`\n=== 크롤링 완료 ===`)
  console.log(`총 ${trends.length}개 기사 수집`)
  console.log(`저장 위치: ${outputPath}`)

  return result
}

// 스크립트 실행
crawlAllNews().catch(console.error)
