import { SHOP_ITEMS } from '../gameContent.js'

export default function ShopModal({ balance, ownedItems, onPurchase, onClose }) {
  const owned = new Set(ownedItems)

  return (
    <div className="shop-modal" role="dialog" aria-modal="true" aria-label="Shleeb Shop">
      <div className="shop-panel">
        <div className="shop-header">
          <div>
            <p className="eyebrow">SHLEEB SHOP</p>
            <h2>Spend the stash.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close shop">
            ✕
          </button>
        </div>

        <p className="shop-balance">Balance: {balance} sheebs</p>

        <div className="shop-grid">
          {SHOP_ITEMS.map((item) => {
            const isOwned = owned.has(item.id)
            const canAfford = balance >= item.cost

            return (
              <article key={item.id} className={`shop-card${isOwned ? ' owned' : ''}`}>
                <div className="shop-card-top">
                  <h3>{item.name}</h3>
                  <span className="shop-cost">{item.cost}</span>
                </div>
                <p className="shop-effect">{item.effectLabel}</p>
                <p className="shop-desc">{item.description}</p>
                <button
                  className="shop-buy-btn"
                  disabled={isOwned || !canAfford}
                  onClick={() => onPurchase(item.id)}
                >
                  {isOwned ? 'OWNED' : canAfford ? 'BUY' : 'NEED MORE SHEEBS'}
                </button>
              </article>
            )
          })}
        </div>

        <p className="shop-note">
          Purchases persist in cookies with your user id, so the shop stays sticky between reloads.
        </p>
      </div>
    </div>
  )
}

