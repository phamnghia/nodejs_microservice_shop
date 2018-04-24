#!/bin/sh
IMG_TAG="1.2"

cd order_service && docker build -t kyllynk/order:$IMG_TAG . && docker push kyllynk/order:$IMG_TAG;

cd ../payment_service && docker build -t kyllynk/payment:$IMG_TAG . && docker push kyllynk/payment:$IMG_TAG;

cd ../product_service && docker build -t kyllynk/product:$IMG_TAG . && docker push kyllynk/product:$IMG_TAG;

cd ../report_service && docker build -t kyllynk/report:$IMG_TAG . && docker push kyllynk/report:$IMG_TAG;

cd ../notification_service && docker build -t kyllynk/notification:$IMG_TAG . && docker push kyllynk/notification:$IMG_TAG;

cd ../public_api_integration_service && docker build -t kyllynk/public-api:$IMG_TAG . && docker push kyllynk/public-api:$IMG_TAG;

cd ../webbase_frontend && docker build -t kyllynk/frontend:$IMG_TAG . && docker push kyllynk/frontend:$IMG_TAG;

echo "DONE!"