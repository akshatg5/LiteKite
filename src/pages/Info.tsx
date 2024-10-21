import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import url from '@/lib/url'
import { Loader2 } from 'lucide-react'

type FinancialData = {
    balance_sheet: any;
    income_statement: any;
    cash_flow_statement: any;
    comprehensive_income: any;
}

type NewsItem = {
    headline: string;
    source: string;
    datetime: string;
    summary: string;
    url : string;
}

export default function Info() {
  const [activeTab, setActiveTab] = useState('financials')
  const params = useParams()
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading,setLoading] = useState(false)
  const stock = params.stock

  const get_fundamentals = async () => {
    try {
      setLoading(true)
        const token = localStorage.getItem("token")
        const res = await axios.get(`${url}/fundamentals/${stock}`, {
            headers : {
                Authorization : token
            }
        })
        setFinancialData(res.data.financials)
        setCompanyName(res.data.company_name)
    } catch (error) {
        console.error("Unable to fetch the financial data", error)
    } finally {
      setLoading(false)
    }
  }

  const get_news = async () => {
    try {
      setLoading(true)
        const token = localStorage.getItem("token")
        const res = await axios.get(`${url}/news/${stock}`, {
            headers : {
                Authorization : token
            }
        })
        setNews(res.data)
    } catch (error) {
        console.error("Unable to fetch the news data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    get_fundamentals()
    get_news()
  }, [stock])

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderFinancialSection = (title: string, data: any) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <ul className="space-y-2">
            {Object.entries(data).map(([key, value]: [string, any]) => (
              <li key={key} className="flex justify-between">
                <span>{value.label}</span>
                <span className="font-semibold">
                  {value.unit === 'USD' ? formatValue(value.value) : value.value}
                </span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-10 py-8">
    <div className='flex justify-between'>
      <h1 className="text-3xl font-bold mb-6">{companyName} Financial Dashboard</h1>
      {/* <Button>Should you buy/sell this? *</Button>     */}
    </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
      {loading && <div>Loading...<Loader2 /></div>}
        
        <TabsContent value="financials">
          {financialData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFinancialSection("Balance Sheet", financialData.balance_sheet)}
              {renderFinancialSection("Income Statement", financialData.income_statement)}
              {renderFinancialSection("Cash Flow Statement", financialData.cash_flow_statement)}
              {renderFinancialSection("Comprehensive Income", financialData.comprehensive_income)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Recent News</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <ul className="space-y-4">
                  {news.map((item, index) => (
                      <Link to={item.url}>
                        <hr className='py-2' />
                    <li key={index} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold">{item.headline}</h3>
                      <p className="text-sm text-muted-foreground">{item.source} - {item.datetime}</p>
                      <p className="mt-2">{item.summary}</p>
                    </li>
                    </Link>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className='p-5 my-5'>
        <CardDescription>All the data is provided by the Finnhub APIs</CardDescription>
        {/* <CardDescription>* AI support by Gemini</CardDescription> */}
      </Card>
    </div>
  )
}