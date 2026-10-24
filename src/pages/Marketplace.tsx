import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, TextField, Tabs, Tab } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { cryptoMeta, CryptoSymbol } from '../state/cryptoMeta'

export default function Marketplace() {
    const { symbol } = useParams<{ symbol: string }>()
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(0)

    const activeSymbol = (symbol?.toUpperCase() || 'BTC') as CryptoSymbol
    const meta = cryptoMeta[activeSymbol] || cryptoMeta['BTC']

    return (
        <div className="p-4 md:p-8 pt-20 max-w-7xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <Button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
                    &larr; Back
                </Button>
                <Typography variant="h4" className="text-white font-bold">
                    Trade {activeSymbol}
                </Typography>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area Placeholder */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="card-base h-[400px] flex items-center justify-center">
                        <Typography className="text-slate-500">
                            Price Chart for {meta.name} ({activeSymbol}) will go here
                        </Typography>
                    </Card>
                </div>

                {/* Trade Interface */}
                <Card className="card-base h-fit">
                    <CardContent className="space-y-6">
                        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} textColor="inherit" indicatorColor="primary">
                            <Tab label="Buy" className="flex-1 font-bold" />
                            <Tab label="Sell" className="flex-1 font-bold" />
                        </Tabs>

                        <div className="space-y-4">
                            <div>
                                <Typography className="text-sm text-slate-400 mb-1">Available Balance</Typography>
                                <Typography className="text-xl text-white font-bold">$12,450.00 USD</Typography>
                            </div>

                            <TextField
                                fullWidth
                                placeholder="0.00"
                                label={`Amount (${activeSymbol})`}
                                variant="outlined"
                                sx={{ input: { color: 'white' }, label: { color: 'gray' }, fieldset: { borderColor: '#333' } }}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                className="font-bold py-3 text-lg shadow-lg"
                                style={{
                                    backgroundColor: tabIndex === 0 ? '#4ade80' : '#f87171',
                                    color: '#000'
                                }}
                            >
                                {tabIndex === 0 ? `Buy ${activeSymbol}` : `Sell ${activeSymbol}`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
