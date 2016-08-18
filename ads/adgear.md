<!---
Copyright 2015 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# AdGear

## Example

### AdGear Console (Publisher) Static Adspot

```html
    <amp-ad width=300 height=250
      type="adgear"
      data-adspot_id="11259090"
      data-chip_key="67c34ce0f1310133dabe0024e87a30c2">
  </amp-ad>
```

### AdGear Console (Publisher) Dynamic Adspot

```html
  <amp-ad width=300 height=250
      type="adgear"
      data-container_id="2133"
      data-chip_key="093a2050837001305df50024e87a30c2"
      data-format_id="12"
      data-path='["Accueil", "Middle"]'>
  </amp-ad>
```

### AdGear Console (Publisher) Static Adspot with impression hints

```html
  <amp-ad width=300 height=250
      type="adgear"
      data-adspot_id="11259090"
      data-chip_key="67c34ce0f1310133dabe0024e87a30c2"
      data-impression_hints='{"age":"18", "gender":"male"}'>
  </amp-ad>
```

### AdGear Console (Agency) Tag

```html
  <amp-ad width=300 height=250
      type="adgear"
      data-placement_id="12345">
  </amp-ad>
```

### AdGear Trader SSP

```html
  <amp-ad width=300 height=250
      type="adgear"
      data-seller_public_id="bde9bd812d564b9cb4b03fdde7ba3199"
      data-format_id="2">
  </amp-ad>
```

### AdGear Trader Universal

```html
  <amp-ad width=300 height=250
      type="adgear"
      data-buyer_public_id="bde9bd812d564b9cb4b03fdde7ba3199"
      data-buyer_security_token="bde9bd812d564b9cb4b03fdde7ba3199"
      data-agdata='{"age":"18", "gender":"male"}'>
  </amp-ad>
```

## Configuration

* data-platform: Platform you want to use. Can be either "console" or "trader"

### Console (Publisher) options

* data-host (optional): HTTPS host associated to your account.

#### Static Adspot

* data-adspot_id (required for static adspot)
* data-chip_key (required for static adspot)

#### Dynamic Adspot

* data-container_id (required for dynamic adspot)
* data-chip_key (required for dynamic adspot)
* data-format_id (required for dynamic adspot)
* data-path (required for dynamic adspot)

#### Optional options, available for both Static and Dynamic Adspot

* data-impression_hints (optional):

### AdGear Trader SSP options

* data-public_buyer_id (required for trader ssp):
* data-format_id (required for trader ssp):

## More information

For more information, please see our [AdGear for Publishers](http://docs.adgear.com/wiki/pages/viewpage.action?pageId=20217877) or [AdGear for Trader](http://docs.adgear.com/wiki/pages/viewpage.action?pageId=75595783) documentation pages.