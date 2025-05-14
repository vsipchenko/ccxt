from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_markets = publicGetMarkets = Entry('markets', 'public', 'GET', {})
    public_get_ohlcv = publicGetOhlcv = Entry('ohlcv', 'public', 'GET', {})
    public_get_ticker = publicGetTicker = Entry('ticker', 'public', 'GET', {})
    private_get_trades = privateGetTrades = Entry('trades', 'private', 'GET', {})
    private_get_positions = privateGetPositions = Entry('positions', 'private', 'GET', {})
    private_get_orders = privateGetOrders = Entry('orders', 'private', 'GET', {})
    private_get_order = privateGetOrder = Entry('order', 'private', 'GET', {})
    private_get_balance = privateGetBalance = Entry('balance', 'private', 'GET', {})
    private_get_leverage_tiers = privateGetLeverageTiers = Entry('leverage_tiers', 'private', 'GET', {})
    private_post_order = privatePostOrder = Entry('order', 'private', 'POST', {})
    private_post_leverage = privatePostLeverage = Entry('leverage', 'private', 'POST', {})
    private_delete_order = privateDeleteOrder = Entry('order', 'private', 'DELETE', {})
