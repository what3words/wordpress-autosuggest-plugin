PLUGIN := 3-word-address-validation-field

.PHONY: check_wp_compatibility
check_wp_compatibility:
	@echo "Checking plugin: $(PLUGIN)"
	@PLUGIN_INFO=$$(curl -s "https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&request%5Bslug%5D=$(PLUGIN)"); \
	PLUGIN_INFO_CLEAN=$$(echo $$PLUGIN_INFO | sed 's/"sections":{[^}]*},//g'); \
	CURRENT_WP_VERSION=$$(curl -s "https://api.wordpress.org/core/version-check/1.7/" | grep -o '"current":"[^"]*"' | cut -d '"' -f 4 | head -n 1); \
	TESTED_VERSION=$$(echo $$PLUGIN_INFO_CLEAN | grep -o '"tested":"[^"]*"' | cut -d '"' -f 4); \
	LATEST_VERSION=$$(echo $$PLUGIN_INFO_CLEAN | grep -o '"version":"[^"]*"' | cut -d '"' -f 4); \
	if [ -z "$$TESTED_VERSION" ] || [ "$$TESTED_VERSION" = "null" ]; then \
		echo "::error::Could not retrieve plugin information for $(PLUGIN) or the plugin has not been tested."; \
		exit 1; \
	elif [ -z "$$LATEST_VERSION" ] || [ "$$LATEST_VERSION" = "null" ]; then \
		echo "::error::Could not retrieve the latest version for $(PLUGIN)."; \
		exit 1; \
	else \
		echo "Plugin version: $$LATEST_VERSION"; \
		echo "Tested up to: $$TESTED_VERSION"; \
		if [ "$$(echo $$CURRENT_WP_VERSION | cut -d '.' -f 1)" -gt "$$(echo $$TESTED_VERSION | cut -d '.' -f 1)" ]; then \
			echo "::error::The plugin hasn't been tested with the latest WordPress major release."; \
			exit 1; \
		elif [ "$$(echo $$CURRENT_WP_VERSION | cut -d '.' -f 2)" -gt "$$(echo $$TESTED_VERSION | cut -d '.' -f 2)" ]; then \
			echo "::error::The plugin hasn't been tested with the latest minor release of WordPress - $$CURRENT_WP_VERSION"; \
			exit 1; \
		else \
			echo "::notice::The plugin is tested with your current version of WordPress"; \
		fi; \
	fi
