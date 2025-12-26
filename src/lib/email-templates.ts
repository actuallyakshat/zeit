interface CookedItemEmailData {
  itemTitle: string;
  itemPrice: number;
  itemImageUrl?: string;
  itemUrl?: string;
  userName?: string;
}

export function createCookedItemEmail(data: CookedItemEmailData): string {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(data.itemPrice);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Item is Ready!</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 300;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .header .emoji {
      font-size: 48px;
      margin-bottom: 16px;
      display: block;
    }

    .content {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 24px;
      font-weight: 300;
    }

    .item-card {
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      background-color: #fafafa;
    }

    .item-image {
      width: 100%;
      max-width: 300px;
      height: auto;
      border-radius: 8px;
      margin: 0 auto 20px;
      display: block;
    }

    .item-title {
      font-size: 24px;
      font-weight: 400;
      color: #1a1a1a;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .item-price {
      font-size: 20px;
      font-weight: 300;
      color: #666;
      margin-bottom: 16px;
    }

    .message {
      font-size: 16px;
      color: #555;
      line-height: 1.8;
      margin: 24px 0;
    }

    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #1a1a1a;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      margin: 24px 0;
      transition: background-color 0.2s;
    }

    .cta-button:hover {
      background-color: #333;
    }

    .footer {
      background-color: #fafafa;
      padding: 30px;
      text-align: center;
      border-top: 1px dashed #e0e0e0;
    }

    .footer-text {
      font-size: 14px;
      color: #999;
      margin-bottom: 8px;
    }

    .footer-brand {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-top: 12px;
    }

    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e0e0e0, transparent);
      margin: 32px 0;
    }

    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px;
      }

      .header {
        padding: 30px 20px;
      }

      .content {
        padding: 30px 20px;
      }

      .header h1 {
        font-size: 24px;
      }

      .item-title {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="emoji">🎉</span>
      <h1>Your Item is Ready!</h1>
    </div>

    <div class="content">
      <p class="greeting">
        ${data.userName ? `Hello ${data.userName},` : "Hello,"}
      </p>

      <p class="message">
        Congratulations! You've successfully waited long enough to afford this item.
        The cooking process is complete, and you can now make your purchase!
      </p>

      <div class="item-card">
        ${
          data.itemImageUrl
            ? `<img src="${data.itemImageUrl}" alt="${data.itemTitle}" class="item-image" />`
            : ""
        }
        <h2 class="item-title">${data.itemTitle}</h2>
        <p class="item-price">${formattedPrice}</p>
      </div>

      <p class="message">
        You've demonstrated patience and discipline by waiting instead of making an impulse purchase.
        Now you can enjoy your reward knowing you've earned it through your time and effort.
      </p>

      ${
        data.itemUrl
          ? `
      <div style="text-align: center;">
        <a href="${data.itemUrl}" class="cta-button">View Item</a>
      </div>
      `
          : ""
      }

      <div class="divider"></div>

      <p class="message" style="font-size: 14px; color: #777;">
        This is an automated notification from Zeit, your wishlist time tracker.
        You're receiving this because an item you were cooking has completed its countdown.
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">Made with care by</p>
      <p class="footer-brand">Zeit</p>
      <p class="footer-text" style="margin-top: 12px;">
        Track your wishlist in time, not money
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
