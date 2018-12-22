package com.prashant.projects.pidash.video;

import com.prashant.projects.pidash.model.Settings;
import com.prashant.projects.pidash.repo.SettingsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VideoAttributesProvider {

    @Autowired
    private SettingsRepo settingsRepo;

    public String getVideoAttributes() {
        Settings settings = settingsRepo.findAll().get(0);
        return new AttributesBuilder()
                .withDynamicRange(settings.getDynamicRange())
                .withEvCompansation(settings.getEvCompansation())
                .withExposure(settings.getExposure())
                .withMetering(settings.getMetering())
                .withQuality(settings.getQuality())
                .withRotation(settings.getRotation())
                .withStabilization(settings.getStabilization())
                .withWhitebalance(settings.getWhitebalance())
                .withVideoOptions(settings.getVideoOptions())
                .withShowPreview(settings.isShowPreview())
                .build();
    }

    private static class AttributesBuilder {
        private StringBuilder attributes = new StringBuilder();

        public AttributesBuilder withQuality(int quality){
            attributes.append(" -md "+quality);
            return this;
        }
        public AttributesBuilder withRotation(int rotation){
            attributes.append(" -rot "+rotation);
            return this;
        }
        public AttributesBuilder withMetering(String metering){
            attributes.append(" -mm "+metering);
            return this;
        }
        public AttributesBuilder withWhitebalance(String whitebalance){
            attributes.append(" -awb "+whitebalance);
            return this;
        }
        public AttributesBuilder withExposure(String exposure){
            attributes.append(" -ex "+exposure);
            return this;
        }
        public AttributesBuilder withStabilization(boolean stabilization){
            if(stabilization)
                attributes.append(" -vs ");
            return this;
        }
        public AttributesBuilder withEvCompansation(int evCompansation){
            attributes.append(" -ev "+evCompansation);
            return this;
        }
        public AttributesBuilder withDynamicRange(String dynamicRange){
            //attributes.append(" -drc "+dynamicRange);
            return this;
        }
        public AttributesBuilder withVideoOptions(String videoOptions){
            if(videoOptions !=null && !"".equals(videoOptions.trim())){
                attributes.append(" "+videoOptions+" ");
            }
            return this;
        }
        public AttributesBuilder withShowPreview(boolean showPreview){
            if(!showPreview){
                attributes.append(" -n ");
            }
            return this;
        }
        public String build() {
            return attributes.toString();
        }

    }
}
