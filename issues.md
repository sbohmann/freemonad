# Issues

Context: iPhone 8 plus with a lot of podcasts

## Kicked - Memory?

App is kicked several times a day because of I guess memory consumption.

## Scrolling

Scrolling is often stuck. Are things done synchronously with waiting
that should rather be event driven? Is it the podcast icon? Something else?

## State

Sometimes, tapping a podcast / episode takes some time.

When tapping again, the UI transition to the new screen happens twice.

Maybe the logical state of the app should be considered when receiving a tap?

E.g. when having logically transitioned, ignore following transitions from the same state?

Could this be an artifact of the custom list views I think I remember having heard about on *the podcast*?

## CarPlay

Also, a lot of state issues. E.g. scroll-wheel selecting the episode is cancelled immediately after but very, very quickly pressing the scroll wheel after moving the selection often works when this happens.

It does not always happen. I do not yet know under whhich circumstances.
