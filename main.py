import ccxt
import time

g = ccxt.gains()

oo1 = g.create_order(
    symbol='ETH/USD',
    type='market',
    side='buy',
    amount=0.1,
    reduceOnly=False
)
time.sleep(5)
oc1 = g.create_order(
    symbol='ETH/USD',
    type='market',
    side='sell',
    amount=0.1,
    reduceOnly=True
)
time.sleep(0.5)
oo2 = g.create_order(
    symbol='ETH/USD',
    type='market',
    side='sell',
    amount=0.1,
    reduceOnly=False
)
ts = oo2['timestamp'] - 10000

print(g.fetch_open_orders('ETH/USD', since=ts))