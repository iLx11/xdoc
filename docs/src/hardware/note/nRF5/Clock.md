
## FLCLK
```c
$(SDK_ROOT)/integration/nrfx/legacy/nrf_drv_clock.c \
$(SDK_ROOT)/modules/nrfx/drivers/src/nrfx_clock.c \
$(SDK_ROOT)/modules/nrfx/drivers/src/nrfx_power.c \
```
### include file
```c
../../../../../../integration/nrfx/legacy
../../../../../../modules/nrfx/drivers/include
```
### 请求时钟
```c
static void lfclk_request(void) {
    uint32_t err_code = nrf_drv_clock_init();
    APP_ERROR_CHECK(err_code);
    nrf_drv_clock_lfclk_request(NULL);
}
```
#### sdk.config.c
```c
clock
```c
// <e> NRF_CLOCK_ENABLED - nrf_drv_clock - CLOCK peripheral driver - legacy layer
//==========================================================
#ifndef NRF_CLOCK_ENABLED
#define NRF_CLOCK_ENABLED 1
#endif
// <o> CLOCK_CONFIG_LF_SRC  - LF Clock Source
 
// <0=> RC 
// <1=> XTAL 
// <2=> Synth 
// <131073=> External Low Swing 
// <196609=> External Full Swing 

#ifndef CLOCK_CONFIG_LF_SRC
#define CLOCK_CONFIG_LF_SRC 1
#endif

// <o> CLOCK_CONFIG_IRQ_PRIORITY  - Interrupt priority
 

// <i> Priorities 0,2 (nRF51) and 0,1,4,5 (nRF52) are reserved for SoftDevice
// <0=> 0 (highest) 
// <1=> 1 
// <2=> 2 
// <3=> 3 
// <4=> 4 
// <5=> 5 
// <6=> 6 
// <7=> 7 

#ifndef CLOCK_CONFIG_IRQ_PRIORITY
#define CLOCK_CONFIG_IRQ_PRIORITY 6
#endif

// </e>

```
### 自定义时钟
### 32.768 kHz synthesized from HFCLK (LFSYNT)
LFCLK can also be synthesized from the HFCLK clock source. The accuracy of LFCLK will then be the accuracy of the HFCLK.
Using the LFSYNT clock avoids the requirement for a 32.768 kHz crystal, but increases average power consumption as the HFCLK will need to be requested in the system.

```c
static void clock_init(void)
{
	// HFCLK oscillator started
    NRF_CLOCK->EVENTS_HFCLKSTARTED = 0;
	// Start HFCLK crystal oscillator
    NRF_CLOCK->TASKS_HFCLKSTART    = 1;
	
    while (NRF_CLOCK->EVENTS_HFCLKSTARTED == 0) { __NOP(); }

	// Clock source for the LFCLK
    NRF_CLOCK->LFCLKSRC            = (CLOCK_LFCLKSRC_SRC_Xtal << CLOCK_LFCLKSRC_SRC_Pos);
	// LFCLK started
    NRF_CLOCK->EVENTS_LFCLKSTARTED = 0;
	// LFCLK status
    NRF_CLOCK->TASKS_LFCLKSTART    = 1;

    while (NRF_CLOCK->EVENTS_LFCLKSTARTED == 0) { __NOP(); }

}
```